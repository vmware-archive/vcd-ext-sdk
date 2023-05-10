import { Injectable, Injector } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError, merge } from 'rxjs';
import { catchError, tap, map, concatMap, publishReplay, refCount, skipWhile, switchMap, withLatestFrom } from 'rxjs/operators';
import { SessionType,
    AuthorizedLocationType,
    ResourceType, LinkType,
    EntityReferenceType,
    EntityType,
    TaskType
} from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { SupportedVersionsType } from '@vcd/bindings/vcloud/api/rest/schema/versioning';
import { AccessibleLocation, AccessibleLocations, Session } from '../openapi';
import { Query } from '../query/index';
import { AuthTokenHolderService, API_ROOT_URL, SESSION_SCOPE, SESSION_ORG_ID } from '../container-hooks';
import { VcdHttpClient } from './vcd.http.client';
import { VcdTransferClient } from './vcd.transfer.client';
import { HTTP_HEADERS } from './constants';
import { filter } from 'rxjs/operators';
import { mapTo } from 'rxjs/operators';

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
                    // @ts-ignore
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

export enum LinkRelType {
    add = 'add',
    remove = 'remove',
    edit = 'edit',
}

/**
 * A basic client for interacting with the VMware Cloud Director APIs.
 *
 * A VMware Cloud Director plugin can get a reference to this client by using angular injection.
 * ```
 *     constructor(private vcdApi: VcdApiClient) {}
 * ```
 *
 * VcdApiClient reuses the authentication from the VCD platform so in general there is
 * no need of an explicit authentication/login.
 *
 * When dealing with the session management there are two APIs:
 * 1. Deprecated legacy API that is using the `api/session` endpoint and the corresponding models
 * 2. Newly added API that is using the `cloudapi` endpoint and the corresponding models
 *
 * Note that if a plugin performs an explicit cloud api authentication call through
 * {@link VcdApiClient#setCloudApiAuthentication} or {@link VcdApiClient#cloudApiLogin}
 * from that moment on the VcdApiClient uses only cloud api session management.
 * This means calls to {@link VcdApiClient#setAuthentication} or {@link VcdApiClient#login} have no effect.
 */
@Injectable()
export class VcdApiClient {
    /** The default list of API versions (from most preferred to least) that the SDK supports. */
    static readonly CANDIDATE_VERSIONS: string[] = ['37.0', '36.3', '36.2', '36.1', '36.0', '35.2', '35.0', '34.0', '33.0'];

    set baseUrl(_baseUrl: string) {
        this._baseUrl = _baseUrl;
    }

    get version(): string {
        return this.http.requestHeadersInterceptor.version;
    }

    private _negotiateVersion: Observable<string>;
    private _baseUrl: string;

    /**
     * @deprecated Use {@link VcdApiClient#_cloudApiSession}
     */
    private _session: BehaviorSubject<SessionType> = new BehaviorSubject<SessionType>(null);
    private _sessionObservable: Observable<SessionType> = this._session.asObservable()
        .pipe(
            skipWhile(session => !session)
        );
    private _getSession: Observable<SessionType>;

    /**
     * CloudApi Session
     */
    private _cloudApiSession: BehaviorSubject<Session> = new BehaviorSubject<Session>(null);
    private _cloudApiSessionObservable: Observable<Session> = this._cloudApiSession.asObservable()
        .pipe(
            skipWhile(session => !session)
        );
    /**
     * This observable has a special purpose when doing automatic login during the constructor initialization.
     * It allows backend call only after an API version is set.
     * It also ensures that a backend call to get the current session is done once prior to any other calls.
     *
     * In case of an explicit cloud api auth request there is no need of this observable
     * since this auth request will retrieve the session itself
     */
    private _getCloudApiSession: Observable<Session>;

    private _cloudApiSessionLinks: BehaviorSubject<LinkType[]> = new BehaviorSubject<LinkType[]>([]);

    /**
     * Cached, lazy loaded observable of the AccessibleLocation array
     */
    private _cloudApiAccessibleLocations: Observable<AccessibleLocation[]>;

    /**
     * This property determines if it is an explicit cloud api login.
     * In this case the old API (/api/session) should not be used at all.
     */
    private _isCloudApiLogin = false;

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
        const token = tokenHolder.jwt ? `Bearer ${tokenHolder.jwt}` : tokenHolder.token;
        this._getSession = this.setAuthentication(token)
            .pipe(
                publishReplay(1),
                refCount()
            );

        this._getCloudApiSession = this.setCloudApiAuthentication(token)
            .pipe(
                publishReplay(1),
                refCount()
            );
        // This is not an explicit cloud api login
        this._isCloudApiLogin = false;
    }

    private negotiateVersion(serverVersions: SupportedVersionsType): string {
        const supportedVersions: string[] = serverVersions.versionInfo.map(versionInfo => versionInfo.version);
        const negotiatedVersions: string[] = VcdApiClient.CANDIDATE_VERSIONS.filter(cv => supportedVersions.some(sv => cv === sv));

        if (negotiatedVersions.length === 0) {
            throw new Error(`The VMware Cloud Director server does not support any API versions
                used by this API client. Client candidate versions: ${VcdApiClient.CANDIDATE_VERSIONS};
                VMware Cloud Director supported versions: ${supportedVersions}`);
        }

        return negotiatedVersions[0];
    }

    /**
     * The purpose of this function is to ensure that prior to sending any call to the backend
     * the version has been set and the current session has been retrieved.
     * Note that this is important during the automatic authentication that is done during the
     * constructor initialization, when the plugin is not required to perform its own explicit authentication
     * but rather the ones from the underlying framework is used.
     */
    private validateRequestContext(): Observable<true> {
        return (this.version ? of(this.version) : this._negotiateVersion)
            .pipe(
                // In case of a cloud api login we are not interested in the /api/session session
                concatMap(() => this._isCloudApiLogin ? of(null) : this._getSession),
                concatMap(() => this._getCloudApiSession
                    // In case of cloud api failure we do not want to prevent further execution
                    // for backward compatibility considerations since this may be a case
                    // when cloud api is not supported at all for the specified version
                    .pipe(catchError((e) => of(true)))
                ),
                mapTo(true)
            );
        }

    /**
     *
     * For use cases wich solely depends on cloudapi without any backward compatibility
     * there should be no dependence on the old /api endpoint at all
     */
    private validateRequestContextCloudApiOnly(): Observable<Session> {
        return (this.version ? of(this.version) : this._negotiateVersion).pipe(
            concatMap(() => this._getCloudApiSession)
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
     * @deprecated Use {@link VcdApiClient#setCloudApiAuthentication}
     *
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
        if (this._isCloudApiLogin) {
            return throwError('Only cloud api auth is allowed since it was already used');
        }

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

    /**
     * Sets the authentication token to use for the VcdApiClient.
     *
     * After setting the token, the client will get the current session
     * information associated with the authenticated token.
     *
     * @param authentication the authentication string (to be used in either the 'Authorization'
     *  or 'x-vcloud-authorization' header)
     *
     * @returns session observable associated with the authentication token
     */
    public setCloudApiAuthentication(authentication: string): Observable<Session> {
        this.onBeforeCloudApiAuthentication();

        return of(true)
            .pipe(
                // Set the authentication as part of the observable in order to ensure the caller has subscribed to the observable
                tap(() => this.http.requestHeadersInterceptor.authentication = authentication),
                switchMap(() => this.http.get<Session>(`${this._baseUrl}/cloudapi/1.0.0/sessions/current`, { observe: 'response' })),
            )
            .pipe(
                this.onCloudApiAuthentication()
            );
    }

    public enableLogging(): VcdApiClient {
        this.http.loggingInterceptor.enabled = true;

        return this;
    }

    /**
     * @deprecated Use {@link VcdApiClient#cloudApiLogin}
     *
     * Creates an authenticated session for the specified credential data.
     *
     * @param username the name of the user to authenticate
     * @param tenant the organization the user belongs to
     * @param password the password for the user
     * @returns an authenticated session for the given credentials
     */
    public login(username: string, tenant: string, password: string): Observable<SessionType> {
        if (this._isCloudApiLogin) {
            return throwError('Only cloud api auth is allowed since it was already used');
        }
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

    /**
     * Creates an authenticated session for the specified credential data using cloud api endpoint.
     *
     * @param username the name of the user to authenticate
     * @param tenant the organization the user belongs to
     * @param password the password for the user
     * @returns an authenticated session for the given credentials
     */
    public cloudApiLogin(username: string, tenant: string, password: string): Observable<Session> {
        this.onBeforeCloudApiAuthentication();

        const authString: string = btoa(`${username}@${tenant}:${password}`);
        let url = `${this._baseUrl}/cloudapi/1.0.0/sessions`;
        if (tenant.toLowerCase() === 'system') {
            url += '/provider';
        }
        return this.http.post<Session>(
            url,
            null,
            {
                observe: 'response',
                headers: new HttpHeaders({ [HTTP_HEADERS.Authorization]: `Basic ${authString}` })
            }
        ).pipe(
            tap((response: HttpResponse<Session>) => {
                // tslint:disable-next-line:max-line-length
                const token = `${response.headers.get('x-vmware-vcloud-token-type')} ${response.headers.get('x-vmware-vcloud-access-token')}`;
                this.http.requestHeadersInterceptor.authentication = token;
            }),
            this.onCloudApiAuthentication()
        );
    }

    /**
     * It is necessary to know if an explicit cloud api auth request was done.
     * This function handles this by setting the corresponding flags, properties etc.
     */
    private onBeforeCloudApiAuthentication() {
        // In case of an explicit cloud api auth request:
        // Set the flag _isCloudApiLogin in order to know that explicit cloud api authentication is done
        // This will help us skip code related to the old api, i.e. we should not allow explicit mix of both the api-s
        this._isCloudApiLogin = true;
        // In case of an explicit cloud api auth request:
        // There is no need of _getCloudApiSession observable which is needed in the automatic login during the constructor initialization.
        // The explicit cloud api auth request will retrieve the session.
        this._getCloudApiSession = of(null);
    }

    /**
     * Handle authentication.
     * This includes getting HATEOAS links, setting the session, handling errors etc.
     */
    private onCloudApiAuthentication(): (source: Observable<HttpResponse<Session>>) => Observable<Session> {
        return (source) => source.pipe(
            tap((resp: HttpResponse<Session>) => {
                // Get HATEOAS links
                try {
                    this.setCloudApiSessionLinks(parseHeaderHateoasLinks(resp.headers.get(HATEOAS_HEADER)));
                } catch (e) {
                    console.log('Error when parsing session HATEOAS links:', e);
                }
            }),
            map(resp => resp.body),
            tap((session: Session) => {
                // Clear previous actAs
                this.actAs(null);
                // automatically set actAs for provider in tenant scope
                if (session.org && session.org.name === 'System' && this.injector.get(SESSION_SCOPE) === 'tenant') {
                    // Automatic actAs only works in versions >=9.5
                    try {
                        this.actAs({ id: this.injector.get(SESSION_ORG_ID) });
                    } catch (e) {
                        console.warn('No SESSION_ORG_ID set in container. Automatic actAs is disabled.');
                    }
                }
            }),
            tap((session: Session) => this._cloudApiSession.next(session)),
            catchError((e) => {
                this.onCloudApiAuthenticationError();
                return throwError(e);
            })
        );
    }

    private onCloudApiAuthenticationError() {
        // Clear the authentication so that any subsequent backend calls are not authenticated
        this.http.requestHeadersInterceptor.authentication = '';
        // _getCloudApiSession is in the center of any backend call, nullify it in order not to prevent those calls
        // since it is easier to troubleshoot failing backend rather than no call
        this._getCloudApiSession = of(null);
        // Clear the links
        this._cloudApiSessionLinks.next([]);
        // Clear the session
        this._cloudApiSession.next(null);
    }

    private setCloudApiSessionLinks(links: LinkType[]) {
        this._cloudApiAccessibleLocations = null;
        this._cloudApiSessionLinks.next(links || []);
    }

    public get<T>(endpoint: string,  options?: { headers?: HttpHeaders }): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.get<T>(this.buildEndpointUrl(endpoint), {...options}))
        );
    }

    public list<T>(endpoint: string, queryBuilder?: Query.Builder, multisite?: boolean | AuthorizedLocationType[]) {
        let url = this.buildEndpointUrl(endpoint);

        if (queryBuilder) {
            url = `${url}${queryBuilder.getCloudAPI()}`;
        }

        return this.validateRequestContext().pipe(
            concatMap(() => !multisite ? this.http.get<T>(url)
            : this.http.get<T>(url, { headers: new HttpHeaders({ _multisite: this.parseMultisiteValue(multisite) }) }))
        );
    }

    public createSync<T>(endpoint: string, item: T, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.post<T>(
                this.buildEndpointUrl(endpoint),
                item,
                {...options}
            ))
        );
    }

    public createAsync<T>(endpoint: string, item: T, options?: { headers?: HttpHeaders }): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.post(
                this.buildEndpointUrl(endpoint),
                item,
                { ...options, observe: 'response' }
            )),
            concatMap(response => this.mapResponseToTask(response, 'POST'))
        );
    }

    public getTransferLink<T>(endpoint: string, item: T, transferRel: string = TRANSFER_LINK_REL): Observable<string> {
        return this.http
            .post(this.buildEndpointUrl(endpoint), item, { observe: 'response' })
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

    public updateSync<T>(endpoint: string, item: T, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.put<T>(
                this.buildEndpointUrl(endpoint),
                item,
                { ...options }
            ))
        );
    }

    public updateAsync<T>(endpoint: string, item: T, options?: { headers?: HttpHeaders }): Observable<TaskType> {

        return this.validateRequestContext().pipe(
            concatMap(() => this.http.put(
                this.buildEndpointUrl(endpoint),
                item,
                { ...options, observe: 'response' }
            )),
            concatMap(response => this.mapResponseToTask(response, 'PUT'))
        );
    }

    public deleteSync(endpoint: string, options?: { headers?: HttpHeaders }): Observable<void> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete<void>(this.buildEndpointUrl(endpoint), { ...options }))
        );
    }

    public deleteAsync(endpoint: string, options?: { headers?: HttpHeaders }): Observable<TaskType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete(this.buildEndpointUrl(endpoint), { ...options, observe: 'response' })),
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

        return throwError(() => new Error(`An asynchronous request was made to [${httpVerb} ${response.url}], but no task was returned.  The operation may still have been successful.`));
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
            return throwError(() => new Error(`No 'remove' link for specified resource.`));
        }

        return this.validateRequestContext().pipe(
            concatMap(() => this.http.delete<TaskType>(link.href))
        );
    }

    /**
     * Queries the VMware Cloud Director API based on the specified Query.Builder instance.
     *
     * @param builder An definition of the query to construct (type, filter, page size, etc.)
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns a query result for the specified query
     */
    public query<T>(builder: Query.Builder, multisite?: boolean): Observable<T>;
    /**
     * Queries the VMware Cloud Director API based on the specified Query.Builder instance.
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
     * Queries the VMware Cloud Director API for the first page of the provided result set.
     *
     * @param result the result set to retrieve the first page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the first page of the query
     */
    public firstPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the VMware Cloud Director API for the first page of the provided result set.
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
            return throwError(() => new Error(`No 'firstPage' link for specified query.`));
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasFirstPage<T>(result: T): boolean {
        return !!this.findLink(result, 'firstPage', (result as ResourceType).type);
    }

    /**
     * Queries the VMware Cloud Director API for the previous page of the provided result set.
     *
     * @param result the result set to retrieve the previous page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the previous page of the query
     */
    public previousPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the VMware Cloud Director API for the previous page of the provided result set.
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
            return throwError(() => new Error(`No 'previousPage' link for specified query.`));
        }

        return this.getQueryPage(link.href, multisite);
    }

    public hasPreviousPage<T>(result: T): boolean {
        return !!this.findLink(result, 'previousPage', (result as ResourceType).type);
    }

    /**
     * Queries the VMware Cloud Director API for the next page of the provided result set.
     *
     * @param result the result set to retrieve the next page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the next page of the query
     */
    public nextPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the VMware Cloud Director API for the next page of the provided result set.
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
            return throwError(() => new Error(`No 'nextPage' link for specified query.`));
        }

        return this.getQueryPage<T>(link.href, multisite);
    }

    public hasNextPage<T>(result: T): boolean {
        return !!this.findLink(result, 'nextPage', (result as ResourceType).type);
    }

    /**
     * Queries the VMware Cloud Director API for the last page of the provided result set.
     *
     * @param result the result set to retrieve the last page of records for
     * @param multisite a flag indicating whether or not to fan the query out to all available sites
     * @returns the records for the last page of the query
     */
    public lastPage<T>(result: T, multisite?: boolean): Observable<T>;
    /**
     * Queries the VMware Cloud Director API for the last page of the provided result set.
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
            return throwError(() => new Error(`No 'lastPage' link for specified query.`));
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
    public canPerformAction(item: Navigable, linkRelType: LinkRelType | string, entityRefType?: string): boolean {
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

    /**
     * @deprecated Use cloudApiSession
     */
    public get session(): Observable<SessionType> {
        return this.validateRequestContext().pipe(
            concatMap(() => this._sessionObservable)
        );
    }

    /**
     * Get Session observable
     */
    public get cloudApiSession(): Observable<Session> {
        return this.validateRequestContextCloudApiOnly().pipe(
            concatMap(() => this._cloudApiSessionObservable)
        );
    }

    public get username(): Observable<string> {
        return merge(
                this.cloudApiSession.pipe(
                    filter(() => this._isCloudApiLogin),
                    map(session => session && session.user && session.user.name)
                ),
                this.session.pipe(
                    filter(() => !this._isCloudApiLogin),
                    map(session => session && session.user)
                )
            );
    }

    public get organization(): Observable<string> {
        return merge(
            this.cloudApiSession.pipe(
                filter(() => this._isCloudApiLogin),
                map(session => session && session.org && session.org.name)
            ),
            this.session.pipe(
                filter(() => !this._isCloudApiLogin),
                map(session => session && session.org)
            )
        );
    }

    /**
     * @deprecated Use cloudApiLocation
     */
    public get location(): Observable<AuthorizedLocationType> {
        return this.session.pipe(
            map(session => session.authorizedLocations.location.find(location => location.locationId === session.locationId))
        );
    }

    /**
     * Gets the location corresponding to the current session
     */
    public get cloudApiLocation(): Observable<AccessibleLocation> {
        return this.cloudApiSession.pipe(
            switchMap(() => {
                if (!this._cloudApiAccessibleLocations) {
                    // Ensure caching for getting AccessibleLocations
                    this._cloudApiAccessibleLocations = this._cloudApiSessionLinks
                        .pipe(
                            // Get the AccessibleLocations link
                            map((links) => this.findLink({ link: links }, 'down', 'AccessibleLocations')),
                            // Fetch AccessibleLocations from the backend
                            switchMap((link: LinkType) => link ? this.http.get<AccessibleLocations>(link.href) : of(null)),
                            // Get the array with all locations (what if there are many pages)
                            map((accessibleLocations: AccessibleLocations) => accessibleLocations && accessibleLocations.values)
                        )
                        .pipe(
                            publishReplay(1),
                            refCount()
                        );
                }
                return this._cloudApiAccessibleLocations;
            }),

            // Need to have the session in order to get its location
            withLatestFrom(this.cloudApiSession),
            // Find the location that corresponds to this session
            map(([accessibleLocations, session]) => {
                if (!accessibleLocations || !session) {
                    return null;
                }
                const sessionLocation = session.location;
                if (!sessionLocation) {
                    return null;
                }
                return accessibleLocations.find(location => location.locationId === sessionLocation);
            }),
        );
    }

    public getLocation(session: SessionType): AuthorizedLocationType {
        return session.authorizedLocations.location.find(location => location.locationId === session.locationId);
    }

    /**
     * Build the endpoint url. If the provided endpoint is already an absolute URL, then return it as it is without
     * any modifications, otherwise consider it as a relative one and prepend the baseUrl as defined by the host application.
     */
    private buildEndpointUrl(endpoint: string): string {
        return endpoint.indexOf('://') > -1 ? endpoint : `${this._baseUrl}/${endpoint}`;
    }

}
