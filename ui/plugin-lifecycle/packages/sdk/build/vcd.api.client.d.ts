import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SessionType, QueryResultRecordsType } from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { Query } from './query';
/**
 * A basic client for interacting with the vCloud Director APIs.
 */
export declare class VcdApiClient {
    private http;
    private injector;
    private _baseUrl;
    baseUrl: string;
    private _version;
    readonly version: string;
    private interceptors;
    private _session;
    constructor(http: HttpClient, injector: Injector);
    setVersion(version: string): VcdApiClient;
    /**
     * Sets the authentication token to use for the VcdApiClient.
     *
     * After setting the token, the client will get the current session
     * information associated with the authenticated token.
     *
     * @param authentication the authentication string (to be used in the 'Authorization' header)
     */
    setAuthentication(authentication: string): Observable<SessionType>;
    enableLogging(): VcdApiClient;
    login(username: String, tenant: String, password: String): Observable<SessionType>;
    query<T>(builder: Query.Builder): Observable<QueryResultRecordsType>;
    readonly username: string;
    readonly organization: string;
    private setAuthenticationOnInterceptor(authentication);
    private extractSessionType(response);
    private handleError<T>(response);
}
