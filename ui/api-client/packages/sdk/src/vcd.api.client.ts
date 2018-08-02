import { Injectable, Injector, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HTTP_INTERCEPTORS, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { LoggingInterceptor, RequestHeadersInterceptor } from './http-interceptors';
import { SessionType, QueryResultRecordsType, AuthorizedLocationType, ResourceType, LinkType } from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { Query } from './query';
import { AuthTokenHolderService, API_ROOT_URL } from './common';

/**
 * A basic client for interacting with the vCloud Director APIs.
 */
@Injectable()
export class VcdApiClient {
    private _baseUrl: string = '';
    set baseUrl(_baseUrl: string) {
        this._baseUrl = _baseUrl;
    }

    private _version: string = '';
    get version(): string {
        return this._version;
    }

    private interceptors: HttpInterceptor[];

    private _session: BehaviorSubject<SessionType> = new BehaviorSubject<SessionType>(null);
    private _sessionObservable: Observable<SessionType> = this._session.asObservable().skipWhile(session => !session);

    constructor(private http: HttpClient, private authToken: AuthTokenHolderService, @Inject(API_ROOT_URL) @Optional() private apiRootUrl: string = '', private injector: Injector) {
        this.interceptors = injector.get(HTTP_INTERCEPTORS);
        this._baseUrl = apiRootUrl;
        this.setAuthentication(this.authToken.token).subscribe();
    }

    public setVersion(version: string): VcdApiClient {
        this._version = version;

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
        this.setAuthenticationOnInterceptor(authentication);

        return this.http.get<SessionType>(`${this._baseUrl}/api/session`, {observe: 'response'})
            .pipe(
                map(this.extractSessionType),
                tap(session => {
                    this._session.next(session);
                })
            );
    }

    public enableLogging(): VcdApiClient {
        for (let interceptor of this.interceptors) {
            if (interceptor instanceof LoggingInterceptor) {
                (interceptor as LoggingInterceptor).enabled = true;
                break;
            }
        }

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
                    this.setAuthenticationOnInterceptor(`${response.headers.get('x-vmware-vcloud-token-type')} ${response.headers.get('x-vmware-vcloud-access-token')}`)
                ),
                map(this.extractSessionType),
                tap(session => {
                    this._session.next(session);
                })
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
        const href = this.findLink(result, 'firstPage').href;
        if (!href) {
            Observable.throw(`No 'firstPage' link for specified query.`);
        }

        return this.getQueryPage(href, multisite);
    }

    public hasFirstPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'firstPage');
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
        const href = this.findLink(result, 'previousPage').href;
        if (!href) {
            Observable.throw(`No 'previousPage' link for specified query.`);
        }

        return this.getQueryPage(href, multisite);
    }

    public hasPreviousPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'previousPage');
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
        const href = this.findLink(result, 'nextPage').href;
        if (!href) {
            Observable.throw(`No 'nextPage' link for specified query.`);
        }

        return this.getQueryPage(href, multisite);
    }

    public hasNextPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'nextPage');
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
        const href = this.findLink(result, 'lastPage').href;
        if (!href) {
            Observable.throw(`No 'lastPage' link for specified query.`);
        }

        return this.getQueryPage(href, multisite);
    }

    public hasLastPage(result: QueryResultRecordsType): boolean {
        return !!this.findLink(result, 'lastPage');
    }

    private getQueryPage<T>(href: string, multisite?: any): Observable<QueryResultRecordsType> {
        this.lastPage
        return !multisite ? this.http.get<T>(href) :
            this.http.get<T>(href, { headers: new HttpHeaders({ '_multisite': this.parseMultisiteValue(multisite) }) });
    }

    private findLink(item: ResourceType, rel: string): LinkType {
        return item.link.find(link => link.rel == rel);
    }

    private parseMultisiteValue(multisite: boolean | AuthorizedLocationType[]): string {
        return typeof multisite === 'boolean' ? (multisite ? 'global' : 'local') : multisite.map(site => site.locationId).join(',');
    }

    public get session(): Observable<SessionType> {
        return this._sessionObservable;
    }

    public get username(): Observable<string> {
        return this._sessionObservable.map(session => session.user);
    }

    public get organization(): Observable<string> {
        return this._sessionObservable.map(session => session.org);
    }

    public get location(): Observable<AuthorizedLocationType> {
        return this._sessionObservable.map(session => session.authorizedLocations.location.find(location => location.locationId == session.locationId));
    }

    public getLocation(session: SessionType): AuthorizedLocationType {
        return session.authorizedLocations.location.find(location => location.locationId == session.locationId);
    }


    private setAuthenticationOnInterceptor(authentication: string): void {
        for (let interceptor of this.interceptors) {
            if (interceptor instanceof RequestHeadersInterceptor) {
                (interceptor as RequestHeadersInterceptor).authentication = authentication;
                break;
            }
        }
    }

    private extractSessionType(response: HttpResponse<any>): SessionType {
        if (response.body.value) {
            return response.body.value as SessionType;
        } else {
            return response.body as SessionType;
        }
    }
}