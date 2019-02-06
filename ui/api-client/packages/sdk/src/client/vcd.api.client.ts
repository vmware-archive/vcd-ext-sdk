import { Injectable, Inject, Optional } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map, concatMap } from 'rxjs/operators';

import { SessionType, QueryResultRecordsType, AuthorizedLocationType, ResourceType, LinkType, EntityReferenceType, EntityType, TaskType } from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { SupportedVersionsType } from '@vcd/bindings/vcloud/api/rest/schema/versioning';
import { Query } from '../query/index';
import { AuthTokenHolderService, API_ROOT_URL } from '../common/index';
import { VcdHttpClient } from "./vcd.http.client";
import { VcdTransferClient } from "./vcd.transfer.client";

export const TRANSFER_LINK_REL = "upload:default";
export type Navigable = ResourceType | { link?: LinkType[] }

export const HATEOAS_HEADER = "Link";

/**
 * Parse out Link headers using a very lazily implemented pull parser
 * @param {string} header '<url1>;name1="value1",name2="value2",<url2>;name3="value3,value4"'
 * @returns {LinkType[]} parsed link headers
 */
function parseHeaderHateoasLinks(header: string): LinkType[] {
    const headerFieldMappings: {[key: string]: keyof LinkType} = {
        href: "href",
        model: "type",
        title: "id",
        rel: "rel"
    };
    let tokenIndex: number = -1;

    function peek(token: string) {
        return header.indexOf(token, tokenIndex + 1);
    }

    function next(token: string) {
        const nextIndex = peek(token);
        if (nextIndex == -1) {
            throw new Error(JSON.stringify({header, token, tokenIndex}));
        }
        tokenIndex = nextIndex;
        return tokenIndex;
    }

    const results: LinkType[] = [];
    while (peek("<") > -1) {
        try {
            const hrefStart = next("<");
            const hrefEnd = next(">");
            const href = header.substring(hrefStart + 1, hrefEnd);
            const result: LinkType = {href, type: null, id: null, rel: null, vCloudExtension: []};
            let comma = peek(",");
            let semicolon = peek(";");
            while ((semicolon > -1 && comma > -1 && semicolon < comma) || (semicolon > -1 && comma == -1)) {
                const nameStart = next(";");
                const nameEnd = next("=");
                const name = header.substring(nameStart + 1, nameEnd).trim().toLowerCase();
                const valueStart = next('"');
                const valueEnd = next('"');
                const value = header.substring(valueStart + 1, valueEnd);
                const mappedName = headerFieldMappings[name];
                if (mappedName) {
                    result[mappedName] = decodeURIComponent(value);
                }
                comma = peek(",");
                semicolon = peek(";");
            }
            results.push(result);
        } catch (error) {  // We will try the next one...
            console.log(error);
        }
    }

    return results;
}

/**
 * A basic client for interacting with the vCloud Director APIs.
 */
@Injectable()
export class VcdApiClient {
    /** The default list of API versions (from most preferred to least) that the SDK supports. */
    static readonly CANDIDATE_VERSIONS: string[] = ['32.0', '31.0', '30.0'];

    set baseUrl(_baseUrl: string) {
        this._baseUrl = _baseUrl;
    }

    get version(): string {
        return this.http.requestHeadersInterceptor.version;
    }

    private _session: BehaviorSubject<SessionType> = new BehaviorSubject<SessionType>(null);
    private _sessionObservable: Observable<SessionType> = this._session.asObservable().skipWhile(session => !session);
    private _negotiateVersion: Observable<string>;
    private _getSession: Observable<SessionType>;

    constructor(private http: VcdHttpClient,
                private authToken: AuthTokenHolderService,
                @Inject(API_ROOT_URL) @Optional() private _baseUrl: string = '') {
        this._negotiateVersion = this.http.get<SupportedVersionsType>(`${this._baseUrl}/api/versions`).pipe(
            map(versions => this.negotiateVersion(versions)),
            tap(version => this.setVersion(version))
        ).publishReplay(1).refCount();

        this._getSession = this.setAuthentication(this.authToken.token).publishReplay(1).refCount();
    }

    private negotiateVersion(serverVersions: SupportedVersionsType): string {
        const supportedVersions: string[] = serverVersions.versionInfo.map(versionInfo => versionInfo.version);
        const negotiatedVersions: string[] = VcdApiClient.CANDIDATE_VERSIONS.filter(cv => supportedVersions.some(sv => cv === sv));

        if (negotiatedVersions.length == 0) {
            throw new Error(`The vCloud Director server does not support any API versions
                used by this API client. Client candidate versions: ${VcdApiClient.CANDIDATE_VERSIONS};
                vCloud Director supported versions: ${supportedVersions}`);
        }

        return negotiatedVersions[0];
    }

    private validateRequestContext(): Observable<SessionType> {
        return (this.version ? Observable.of(this.version) : this._negotiateVersion).pipe(
            concatMap(() => this._getSession)
        );
    }

    public setVersion(_version: string): VcdApiClient {
        this.http.requestHeadersInterceptor.version = _version;
        return this;
    }

    /**
     * Sets the authentication token to use for the VcdApiClient.
     *
     * After setting the token, the client will get the current session
     * information associated with the authenticated token.
     *
     * @param authentication the authentication string (to be used in either the 'Authorization'
     *  or 'x-vcloud-authorization' header)
     * @returns the session associated with the authentication token
     */
    public setAuthentication(authentication: string): Observable<SessionType> {
        this.http.requestHeadersInterceptor.authentication = authentication;
        return this.http.get<SessionType>(`${this._baseUrl}/api/session`).pipe(
                tap(session => this._session.next(session))
            );
    }

    public enableLogging(): VcdApiClient {
        this.http.loggingInterceptor.enabled = true;

        return this;
    }

    /**
     * Creates an authenticated session for the specified credential data.
     *
     * @param username the name of the user to authenticate
     * @param tenant the organization the user belongs to
     * @param password the password for the user
     * @returns an authenticated session for the given credentials
     */
    public login(username: String, tenant: String, password: String): Observable<SessionType> {
        const authString: String = btoa(`${username}@${tenant}:${password}`);

        return this.http.post<SessionType>(`${this._baseUrl}/api/sessions`, null, { observe: 'response', headers: new HttpHeaders({ 'Authorization': `Basic ${authString}` }) })
            .pipe(
                tap((response: HttpResponse<any>) =>
                    this.http.requestHeadersInterceptor.authentication = `${response.headers.get('x-vmware-vcloud-token-type')} ${response.headers.get('x-vmware-vcloud-access-token')}`
                ),
                map(response => response.body),
                tap(session => this._session.next(session))
            );
    }

    public get<T>(endpoint: string): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.get<T>(`${this._baseUrl}/${endpoint}`))
        );
    }

    public createSync<T>(endpoint: string, item: T): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.post<T>(`${this._baseUrl}/${endpoint}`, item))
        )
    }

    public createAsync<T>(endpoint: string, item: T): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.post(`${this._baseUrl}/${endpoint}`, item, { observe: 'response' })),
            concatMap(response => this.mapResponseToTask(response, 'POST'))
        );
    }

    public getTransferLink<T>(endpoint: string, item: T, transferRel: string = TRANSFER_LINK_REL): Observable<string> {
        return this.http
            .post(`${this._baseUrl}/${endpoint}`, item, { observe: 'response' })
            .map((res: HttpResponse<T & Navigable>) => {
                const headerLinks: LinkType[] = res.headers.has(HATEOAS_HEADER)
                    ? parseHeaderHateoasLinks(res.headers.get(HATEOAS_HEADER))
                    : [];
                const links: LinkType[] = res.body.link || [];
                const link = [...headerLinks, ...links]
                    .find((link) => link.rel == transferRel);
                if (!link) {
                    throw new Error(`Response from ${endpoint} did not contain a transfer link`);
                }
                return link.href;
            });
    }

    public startTransfer<T>(endpoint: string, item: T, transferRel: string = TRANSFER_LINK_REL): Observable<VcdTransferClient> {
        return this.getTransferLink(endpoint, item, transferRel)
            .map((transferUrl) => new VcdTransferClient(this.http, transferUrl));
    }

    public updateSync<T>(endpoint: string, item: T): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.put<T>(`${this._baseUrl}/${endpoint}`, item))
        );
    }

    public updateAsync<T>(endpoint: string, item: T): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.put(`${this._baseUrl}/${endpoint}`, item, { observe: 'response' })),
            concatMap(response => this.mapResponseToTask(response, 'PUT'))
        );
    }

    public deleteSync(endpoint: string): Observable<void> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete<void>(`${this._baseUrl}/${endpoint}`))
        );
    }

    public deleteAsync(endpoint: string): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete(`${this._baseUrl}/${endpoint}`, { observe: 'response' })),
            concatMap(response => this.mapResponseToTask(response, 'DELETE'))
        );
    }

    private mapResponseToTask(response: HttpResponse<any>, httpVerb: string): Observable<TaskType> {
        if (response.headers.has('Location') && response.status == 202) {
            return this.http.get<TaskType>(response.headers.get('Location'));
        } else if (response.body && response.body.type.startsWith('application/vnd.vmware.vcloud.task+')) {
            const task: TaskType = Object.assign(new TaskType(), response.body);
            return Observable.of(task);
        }

        return Observable.throw(`An asynchronous request was made to [${httpVerb} ${response.url}], but no task was returned.  The operation may still have been successful.`);
    }

    public getEntity<T extends EntityReferenceType>(entityRef: EntityReferenceType): Observable<T>;
    public getEntity<T extends EntityReferenceType>(urn: string): Observable<T>;
    public getEntity<T extends EntityReferenceType>(entityRefOrUrn: EntityReferenceType | string): Observable<T> {
        const entityResolver: Observable<EntityType> = typeof entityRefOrUrn === "string" ?
            this.http.get<EntityType>(`${this._baseUrl}/api/entity/${entityRefOrUrn}`) :
            this.http.get<EntityType>(`${this._baseUrl}/api/entity/urn:vcloud:${entityRefOrUrn.type}:${entityRefOrUrn.id}`);

        return this.validateRequestContext().pipe(
            concatMap(() => entityResolver),
            concatMap(entity => this.http.get<T>(`${entity.link[0].href}`))
        );
    }

    public updateTask(task: TaskType): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.get<TaskType>(task.href))
        );
    }

    public isTaskComplete(task: TaskType): boolean {
        return ['success', 'error', 'canceled', 'aborted'].indexOf(task.status) > -1;
    }

    public removeItem(item: Navigable): Observable<TaskType> {
        const link: LinkType = this.findLink(item, 'remove', null);
        if (!link) {
            return Observable.throw(`No 'remove' link for specified resource.`);
        }

        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete<TaskType>(link.href))
        );
    }

    /**
     * Queries the vCloud Director API based on the specified Query.Builder instance.
     *
     * @param builder An definition of the query to construct (type, filter, page size, etc.)
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns a query result for the specified query
     */
    public query<T>(builder: Query.Builder, multisite?: boolean): Observable<QueryResultRecordsType>;
    /**
     * Queries the vCloud Director API based on the specified Query.Builder instance.
     *
     * @param builder An definition of the query to construct (type, filter, page size, etc.)
     * @param multisite the set of site locations to include in the query fanout
     * @returns a query result for the specified query
     */
    public query<T>(builder: Query.Builder, multisite?: AuthorizedLocationType[]): Observable<QueryResultRecordsType>;
    public query<T>(builder: Query.Builder, multisite?: any): Observable<QueryResultRecordsType> {
        return this.getQueryPage(`${this._baseUrl}/api/query${builder.get()}`, multisite);
    }

    /**
     * Queries the vCloud Director API for the first page of the provided result set.
     *
     * @param result the result set to retrieve the first page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the first page of the query
     */
    public firstPage<T>(result: QueryResultRecordsType, multisite?: boolean): Observable<QueryResultRecordsType>;
    /**
     * Queries the vCloud Director API for the first page of the provided result set.
     *
     * @param result the result set to retrieve the first page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the first page of the query
     */
    public firstPage<T>(result: QueryResultRecordsType, multisite?: AuthorizedLocationType[]): Observable<QueryResultRecordsType>;
    public firstPage<T>(result: QueryResultRecordsType, multisite?: any): Observable<QueryResultRecordsType> {
        const link: LinkType = this.findLink(result, 'firstPage', result.type);
        if (!link) {
            return Observable.throw(`No 'firstPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasFirstPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'firstPage', result.type);
    }

    /**
     * Queries the vCloud Director API for the previous page of the provided result set.
     *
     * @param result the result set to retrieve the previous page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the previous page of the query
     */
    public previousPage<T>(result: QueryResultRecordsType, multisite?: boolean): Observable<QueryResultRecordsType>;
    /**
     * Queries the vCloud Director API for the previous page of the provided result set.
     *
     * @param result the result set to retrieve the previous page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the previous page of the query
     */
    public previousPage<T>(result: QueryResultRecordsType, multisite?: AuthorizedLocationType[]): Observable<QueryResultRecordsType>;
    public previousPage<T>(result: QueryResultRecordsType, multisite?: any): Observable<QueryResultRecordsType> {
        const link: LinkType = this.findLink(result, 'previousPage', result.type);
        if (!link) {
            return Observable.throw(`No 'previousPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasPreviousPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'previousPage', result.type);
    }

    /**
     * Queries the vCloud Director API for the next page of the provided result set.
     *
     * @param result the result set to retrieve the next page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the next page of the query
     */
    public nextPage<T>(result: QueryResultRecordsType, multisite?: boolean): Observable<QueryResultRecordsType>;
    /**
     * Queries the vCloud Director API for the next page of the provided result set.
     *
     * @param result the result set to retrieve the next page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the next page of the query
     */
    public nextPage<T>(result: QueryResultRecordsType, multisite?: AuthorizedLocationType[]): Observable<QueryResultRecordsType>;
    public nextPage<T>(result: QueryResultRecordsType, multisite?: any): Observable<QueryResultRecordsType> {
        const link: LinkType = this.findLink(result, 'nextPage', result.type);
        if (!link) {
            return Observable.throw(`No 'nextPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasNextPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'nextPage', result.type);
    }

    /**
     * Queries the vCloud Director API for the last page of the provided result set.
     *
     * @param result the result set to retrieve the last page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the last page of the query
     */
    public lastPage<T>(result: QueryResultRecordsType, multisite?: boolean): Observable<QueryResultRecordsType>;
    /**
     * Queries the vCloud Director API for the last page of the provided result set.
     *
     * @param result the result set to retrieve the last page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the last page of the query
     */
    public lastPage<T>(result: QueryResultRecordsType, multisite?: AuthorizedLocationType[]): Observable<QueryResultRecordsType>;
    public lastPage<T>(result: QueryResultRecordsType, multisite?: any): Observable<QueryResultRecordsType> {
        const link: LinkType = this.findLink(result, 'lastPage', result.type);
        if (!link) {
            return Observable.throw(`No 'lastPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasLastPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'lastPage', result.type);
    }

    private getQueryPage<T>(href: string, multisite?: any): Observable<QueryResultRecordsType> {
        return this.validateRequestContext().pipe(
            concatMap(() => !multisite ? this.http.get<T>(href) :
                    this.http.get<T>(href, { headers: new HttpHeaders({ '_multisite': this.parseMultisiteValue(multisite) }) }))
        );
    }

    private findLink(item: Navigable, rel: string, type: string): LinkType {
        if (!item || !item.link) {
            return undefined;
        }

        return item.link.find(link => link.rel == rel && link.type == type);
    }

    private parseMultisiteValue(multisite: boolean | AuthorizedLocationType[]): string {
        return typeof multisite === 'boolean' ? (multisite ? 'global' : 'local') : multisite.map(site => site.locationId).join(',');
    }

    public get session(): Observable<SessionType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this._sessionObservable)
        );
    }

    public get username(): Observable<string> {
        return this.session.map(session => session.user);
    }

    public get organization(): Observable<string> {
        return this.session.map(session => session.org);
    }

    public get location(): Observable<AuthorizedLocationType> {
        return this.session.map(session => session.authorizedLocations.location.find(location => location.locationId == session.locationId));
    }

    public getLocation(session: SessionType): AuthorizedLocationType {
        return session.authorizedLocations.location.find(location => location.locationId == session.locationId);
    }
}
