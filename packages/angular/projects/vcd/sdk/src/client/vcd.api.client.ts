import { Injectable, Injector } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, concatMap, publishReplay, refCount, skipWhile } from 'rxjs/operators';

import { SessionType,
    AuthorizedLocationType,
    ResourceType, LinkType,
    EntityReferenceType,
    EntityType,
    TaskType
} from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { SupportedVersionsType } from '@vcd/bindings/vcloud/api/rest/schema/versioning';
import { Query } from '../query/index';
import { AuthTokenHolderService, API_ROOT_URL, SESSION_SCOPE, SESSION_ORG_ID } from '../common/index';
import { VcdHttpClient } from './vcd.http.client';
import { VcdTransferClient } from './vcd.transfer.client';

export const TRANSFER_LINK_REL = 'upload:default';
export type Navigable = ResourceType | { link?: LinkType[] };

export const HATEOAS_HEADER = 'Link';

// tslint:disable:variable-name

/**
 * Parse out Link headers using a very lazily implemented pull parser
 * @param header '<url1>;name1="value1",name2="value2",<url2>;name3="value3,value4"'
 * @returns parsed link headers
 */
export function parseHeaderHateoasLinks(header: string): LinkType[] {
    const results: LinkType[] = [];

    if (!header) {
        return results;
    }

    const headerFieldMappings: {[key: string]: keyof LinkType} = {
        href: 'href',
        model: 'type',
        title: 'id',
        rel: 'rel'
    };
    let tokenIndex = -1;

    function peek(token: string) {
        return header.indexOf(token, tokenIndex + 1);
    }

    function next(token: string) {
        const nextIndex = peek(token);
        if (nextIndex === -1) {
            throw new Error(JSON.stringify({header, token, tokenIndex}));
        }
        tokenIndex = nextIndex;
        return tokenIndex;
    }

    while (peek('<') > -1) {
        try {
            const hrefStart = next('<');
            const hrefEnd = next('>');
            const href = header.substring(hrefStart + 1, hrefEnd);
            const result: LinkType = {href, type: null, id: null, rel: null, vCloudExtension: []};
            let comma = peek(',');
            let semicolon = peek(';');
            while ((semicolon > -1 && comma > -1 && semicolon < comma) || (semicolon > -1 && comma === -1)) {
                const nameStart = next(';');
                const nameEnd = next('=');
                const name = header.substring(nameStart + 1, nameEnd).trim().toLowerCase();
                const valueStart = next('"');
                const valueEnd = next('"');
                const value = header.substring(valueStart + 1, valueEnd);
                const mappedName = headerFieldMappings[name];
                if (mappedName) {
                    result[mappedName] = decodeURIComponent(value) as any;
                }
                comma = peek(',');
                semicolon = peek(';');
            }
            results.push(result);
        } catch (error) {  // We will try the next one...
            console.log(error);
        }
    }

    return results;
}

export enum LinkRelType{
    add = "add",
    remove = "remove",
    edit = "edit",
}

/**
 * A basic client for interacting with the vCloud Director APIs.
 */
@Injectable()
export class VcdApiClient {
    /** The default list of API versions (from most preferred to least) that the SDK supports. */
    static readonly CANDIDATE_VERSIONS: string[] = ['35.0', '34.0', '33.0', '32.0', '31.0', '30.0'];

    set baseUrl(_baseUrl: string) {
        this._baseUrl = _baseUrl;
    }

    private normalizeBaseUrl() {
        return this._baseUrl ? `${this._baseUrl}/` : ""
    }

    get version(): string {
        return this.http.requestHeadersInterceptor.version;
    }

    private _session: BehaviorSubject<SessionType> = new BehaviorSubject<SessionType>(null);
    private _sessionObservable: Observable<SessionType> = this._session.asObservable()
        .pipe(
            skipWhile(session => !session)
        );
    private _negotiateVersion: Observable<string>;
    private _getSession: Observable<SessionType>;
    private _baseUrl: string;

    constructor(private http: VcdHttpClient,
                private injector: Injector) {
        this._baseUrl = this.injector.get(API_ROOT_URL);
        this._negotiateVersion = this.http.get<SupportedVersionsType>(`${this._baseUrl}/api/versions`).pipe(
            map(versions => this.negotiateVersion(versions)),
            tap(version => this.setVersion(version))
        )
        .pipe(
            publishReplay(1),
            refCount()
        );

        const tokenHolder: AuthTokenHolderService = this.injector.get(AuthTokenHolderService, { token: '' });
        this._getSession = this.setAuthentication(tokenHolder.token)
            .pipe(
                publishReplay(1),
                refCount()
            );
    }

    private negotiateVersion(serverVersions: SupportedVersionsType): string {
        const supportedVersions: string[] = serverVersions.versionInfo.map(versionInfo => versionInfo.version);
        const negotiatedVersions: string[] = VcdApiClient.CANDIDATE_VERSIONS.filter(cv => supportedVersions.some(sv => cv === sv));

        if (negotiatedVersions.length === 0) {
            throw new Error(`The vCloud Director server does not support any API versions
                used by this API client. Client candidate versions: ${VcdApiClient.CANDIDATE_VERSIONS};
                vCloud Director supported versions: ${supportedVersions}`);
        }

        return negotiatedVersions[0];
    }

    private validateRequestContext(): Observable<SessionType> {
        return (this.version ? of(this.version) : this._negotiateVersion).pipe(
            concatMap(() => this._getSession)
        );
    }

    public setVersion(_version: string): VcdApiClient {
        this.http.requestHeadersInterceptor.version = _version;
        return this;
    }

    /**
     * Allows a provider user to execute API requests in the scope of a specific tenant.
     *
     * This scoping is available to query-based API calls and to bulk GET calls in the
     * /cloudapi space.
     *
     * @param actAs an entityRef of the tenant (organization) to scope subsequent calls to in
     *  the VcdApiClient, or null/no parameter to remove tenant-specific scoping
     * @returns the current VcdApiClient instance (for chaining)
     */
    public actAs(actAs: EntityReferenceType = null): VcdApiClient {
        this.http.requestHeadersInterceptor.actAs = !actAs ? null : actAs.id;
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
                tap(session => {
                    // automatically set actAs for provider in tenant scope
                    if (session.org === 'System' && this.injector.get(SESSION_SCOPE) === 'tenant') {
                        // Automatic actAs only works in versions >=9.5
                        try {
                            this.actAs({id: this.injector.get(SESSION_ORG_ID)});
                        } catch (e) {
                            console.warn('No SESSION_ORG_ID set in container. Automatic actAs is disabled.');
                        }
                    }
                }),
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
    public login(username: string, tenant: string, password: string): Observable<SessionType> {
        const authString: string = btoa(`${username}@${tenant}:${password}`);

        return this.http.post<SessionType>(
            `${this._baseUrl}/api/sessions`,
            null,
            {
                observe: 'response',
                headers: new HttpHeaders({ Authorization: `Basic ${authString}`})
            }
        )
        .pipe(
            tap((response: HttpResponse<any>) =>
                // tslint:disable-next-line:max-line-length
                this.http.requestHeadersInterceptor.authentication = `${response.headers.get('x-vmware-vcloud-token-type')} ${response.headers.get('x-vmware-vcloud-access-token')}`
            ),
            map(response => response.body),
            tap(session => this._session.next(session))
        );
    }

    public get<T>(endpoint: string): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.get<T>(`${this.normalizeBaseUrl()}${endpoint}`))
        );
    }

    public list<T>(endpoint: string, queryBuilder?: Query.Builder, multisite?: boolean | AuthorizedLocationType[]) {
        let url = `${this.normalizeBaseUrl()}${endpoint}`;

        if (queryBuilder) {
            url = `${url}${queryBuilder.getCloudAPI()}`
        }

        return this.validateRequestContext().pipe(
            concatMap(() => !multisite ? this.http.get<T>(url)
            : this.http.get<T>(url, { headers: new HttpHeaders({ _multisite: this.parseMultisiteValue(multisite) }) }))
        );
    }

    public createSync<T>(endpoint: string, item: T): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.post<T>(`${this.normalizeBaseUrl()}${endpoint}`, item))
        );
    }

    public createAsync<T>(endpoint: string, item: T): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.post(`${this.normalizeBaseUrl()}${endpoint}`, item, { observe: 'response' })),
            concatMap(response => this.mapResponseToTask(response, 'POST'))
        );
    }

    public getTransferLink<T>(endpoint: string, item: T, transferRel: string = TRANSFER_LINK_REL): Observable<string> {
        return this.http
            .post(`${this.normalizeBaseUrl()}${endpoint}`, item, { observe: 'response' })
            .pipe(
                map((res: HttpResponse<T & Navigable>) => {
                    const headerLinks: LinkType[] = res.headers.has(HATEOAS_HEADER)
                        ? parseHeaderHateoasLinks(res.headers.get(HATEOAS_HEADER))
                        : [];
                    const links: LinkType[] = res.body ? (res.body.link || []) : [];
                    const link = [...headerLinks, ...links]
                        .find((l) => l.rel === transferRel);
                    if (!link) {
                        throw new Error(`Response from ${endpoint} did not contain a transfer link`);
                    }
                    return link.href;
                })
            );
    }

    public startTransfer<T>(endpoint: string, item: T, transferRel: string = TRANSFER_LINK_REL): Observable<VcdTransferClient> {
        return this.getTransferLink(endpoint, item, transferRel)
            .pipe(
                map((transferUrl) => new VcdTransferClient(this.http, transferUrl))
            );
    }

    public updateSync<T>(endpoint: string, item: T): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.put<T>(`${this.normalizeBaseUrl()}${endpoint}`, item))
        );
    }

    public updateAsync<T>(endpoint: string, item: T): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.put(`${this.normalizeBaseUrl()}${endpoint}`, item, { observe: 'response' })),
            concatMap(response => this.mapResponseToTask(response, 'PUT'))
        );
    }

    public deleteSync(endpoint: string): Observable<void> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete<void>(`${this.normalizeBaseUrl()}${endpoint}`))
        );
    }

    public deleteAsync(endpoint: string): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete(`${this.normalizeBaseUrl()}${endpoint}`, { observe: 'response' })),
            concatMap(response => this.mapResponseToTask(response, 'DELETE'))
        );
    }

    private mapResponseToTask(response: HttpResponse<any>, httpVerb: string): Observable<TaskType> {
        if (response.headers.has('Location') && response.status === 202) {
            return this.http.get<TaskType>(response.headers.get('Location'));
        } else if (response.body && response.body.type.startsWith('application/vnd.vmware.vcloud.task+')) {
            const task: TaskType = Object.assign(new TaskType(), response.body);
            return of(task);
        }

        // tslint:disable-next-line:max-line-length
        return Observable.throw(`An asynchronous request was made to [${httpVerb} ${response.url}], but no task was returned.  The operation may still have been successful.`);
    }

    public getEntity<T extends EntityReferenceType>(entityRef: EntityReferenceType): Observable<T>;
    // tslint:disable-next-line:unified-signatures
    public getEntity<T extends EntityReferenceType>(urn: string): Observable<T>;
    public getEntity<T extends EntityReferenceType>(entityRefOrUrn: EntityReferenceType | string): Observable<T> {
        const entityResolver: Observable<EntityType> = typeof entityRefOrUrn === 'string' ?
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
    public query<T>(builder: Query.Builder, multisite?: boolean): Observable<T>;
    /**
     * Queries the vCloud Director API based on the specified Query.Builder instance.
     *
     * @param builder An definition of the query to construct (type, filter, page size, etc.)
     * @param multisite the set of site locations to include in the query fanout
     * @returns a query result for the specified query
     */
    // tslint:disable-next-line:unified-signatures
    public query<T>(builder: Query.Builder, multisite?: AuthorizedLocationType[]): Observable<T>;
    public query<T>(builder: Query.Builder, multisite?: any): Observable<T> {
        return this.getQueryPage(`${this._baseUrl}/api/query${builder.get()}`, multisite);
    }

    /**
     * Queries the vCloud Director API for the first page of the provided result set.
     *
     * @param result the result set to retrieve the first page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the first page of the query
     */
    public firstPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the vCloud Director API for the first page of the provided result set.
     *
     * @param result the result set to retrieve the first page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the first page of the query
     */
    // tslint:disable-next-line:unified-signatures
    public firstPage<T>(result: T, multisite?: AuthorizedLocationType[]): Observable<T>;
    public firstPage<T>(result: T, multisite?: any): Observable<T> {
        const link: LinkType = this.findLink(result, 'firstPage', (result as ResourceType).type);
        if (!link) {
            return Observable.throw(`No 'firstPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasFirstPage<T>(result: T): boolean {
        return !!this.findLink(result, 'firstPage', (result as ResourceType).type);
    }

    /**
     * Queries the vCloud Director API for the previous page of the provided result set.
     *
     * @param result the result set to retrieve the previous page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the previous page of the query
     */
    public previousPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the vCloud Director API for the previous page of the provided result set.
     *
     * @param result the result set to retrieve the previous page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the previous page of the query
     */
    // tslint:disable-next-line:unified-signatures
    public previousPage<T>(result: T, multisite?: AuthorizedLocationType[]): Observable<T>;
    public previousPage<T>(result: T, multisite?: any): Observable<T> {
        const link: LinkType = this.findLink(result, 'previousPage', (result as ResourceType).type);
        if (!link) {
            return Observable.throw(`No 'previousPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasPreviousPage<T>(result: T): boolean {
        return !!this.findLink(result, 'previousPage', (result as ResourceType).type);
    }

    /**
     * Queries the vCloud Director API for the next page of the provided result set.
     *
     * @param result the result set to retrieve the next page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the next page of the query
     */
    public nextPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the vCloud Director API for the next page of the provided result set.
     *
     * @param result the result set to retrieve the next page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the next page of the query
     */
    // tslint:disable-next-line:unified-signatures
    public nextPage<T>(result: T, multisite?: AuthorizedLocationType[]): Observable<T>;
    public nextPage<T>(result: T, multisite?: any): Observable<T> {
        const link: LinkType = this.findLink(result, 'nextPage', (result as ResourceType).type);
        if (!link) {
            return Observable.throw(`No 'nextPage' link for specified query.`);
        }

        return this.getQueryPage<T>(link.href, multisite);
    }

    public hasNextPage<T>(result: T): boolean {
        return !!this.findLink(result, 'nextPage', (result as ResourceType).type);
    }

    /**
     * Queries the vCloud Director API for the last page of the provided result set.
     *
     * @param result the result set to retrieve the last page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the last page of the query
     */
    public lastPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the vCloud Director API for the last page of the provided result set.
     *
     * @param result the result set to retrieve the last page of records for
     * @param multisite the set of site locations to include in the query fanout
     * @returns the records for the last page of the query
     */
    // tslint:disable-next-line:unified-signatures
    public lastPage<T>(result: T, multisite?: AuthorizedLocationType[]): Observable<T>;
    public lastPage<T>(result: T, multisite?: any): Observable<T> {
        const link: LinkType = this.findLink(result, 'lastPage', (result as ResourceType).type);
        if (!link) {
            return Observable.throw(`No 'lastPage' link for specified query.`);
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasLastPage<T>(result: T): boolean {
        return !!this.findLink(result, 'lastPage', (result as ResourceType).type);
    }

    private getQueryPage<T>(href: string, multisite?: any): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => !multisite ? this.http.get<T>(href) :
                    this.http.get<T>(href, { headers: new HttpHeaders({ _multisite: this.parseMultisiteValue(multisite) }) }))
        );
    }

  /**
   * Use to perform action availability check before calling the API
   * @param item - the navigable item (containing link collection)
   * @param linkRelType - the link rel type, pass either LinkRelType or string
   * @param entityRefType - the entity reference type
   */
    public canPerformAction(item: Navigable, linkRelType: LinkRelType | string, entityRefType?: string): boolean{
        return !!this.findLink(item, linkRelType, entityRefType);
    }

    private findLink(item: Navigable, rel: string, type: string): LinkType {
        if (!item || !item.link) {
            return undefined;
        }

        return item.link.find((link) => {
            if (type) {
                return link.rel.includes(rel) && link.type === type;
            }

            return link.rel.includes(rel);
        });
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
        return this.session.pipe(
            map(session => session.user)
        );
    }

    public get organization(): Observable<string> {
        return this.session.pipe(
            map(session => session.org)
        );
    }

    public get location(): Observable<AuthorizedLocationType> {
        return this.session.pipe(
            map(session => session.authorizedLocations.location.find(location => location.locationId === session.locationId))
        );
    }

    public getLocation(session: SessionType): AuthorizedLocationType {
        return session.authorizedLocations.location.find(location => location.locationId === session.locationId);
    }
}
