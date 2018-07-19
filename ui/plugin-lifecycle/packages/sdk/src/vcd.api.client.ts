import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HTTP_INTERCEPTORS, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { LoggingInterceptor, RequestHeadersInterceptor } from './http-interceptors/index';
import { SessionType, QueryResultRecordsType } from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { Query } from './query';

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

    private _session: SessionType;

    constructor(private http: HttpClient, private injector: Injector) {
        this.interceptors = injector.get(HTTP_INTERCEPTORS);
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
     * @param authentication the authentication string (to be used in the 'Authorization' header)
     */
    public setAuthentication(authentication: string): Observable<SessionType> {
        this.setAuthenticationOnInterceptor(authentication);

        return this.http.get<SessionType>(`${this._baseUrl}/api/session`, {observe: 'response'})
            .pipe(
                catchError(this.handleError),
                map(this.extractSessionType),
                tap(session => {
                    this._session = session;
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

    public login(username: String, tenant: String, password: String): Observable<SessionType> {
        const authString: String = btoa(`${username}@${tenant}:${password}`);

        return this.http.post<SessionType>(`${this._baseUrl}/api/sessions`, null, { observe: 'response', headers: new HttpHeaders({ 'Authorization': `Basic ${authString}` }) })
            .pipe(
                catchError(this.handleError),
                tap((response: HttpResponse<any>) =>
                    this.setAuthenticationOnInterceptor(`${response.headers.get('x-vmware-vcloud-token-type')} ${response.headers.get('x-vmware-vcloud-access-token')}`)
                ),
                map(this.extractSessionType),
                tap(session => {
                    this._session = session;
                })
            );
    }

    public query<T>(builder: Query.Builder): Observable<QueryResultRecordsType> {
        return this.http.get<T>(`${this._baseUrl}/api/query${builder.get()}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public get username(): string {
        return this._session.user;
    }

    public get organization(): string {
        return this._session.org;
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

    private handleError<T>(response: HttpErrorResponse): Observable<T> {
        const error = new DOMParser().parseFromString(response.error, 'text/xml').getElementsByTagName('Error')[0];
        console.error(`Error occurred communicating with server:
            message: ${error.getAttribute('message')}
            request id: ${response.headers.get('x-vmware-vcloud-request-id')}
        `);
        return empty();
    }
}
