import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {
    private _baseUrl = "https://bos1-vcd-sp-static-200-117.eng.vmware.com";
    private _authToken: string;

    constructor(private http: Http) {}

    /**
     * Setter of auth token property.
     * @param val the value to be set on auth token prop.
     */
    private setAuthToken(val: string): void {
        this._authToken = val;
    }

    /**
     * Getter of auth token property.
     */
    public getAuthToken(): string {
        return this._authToken;
    }

    /**
     * Creates authorization request.
     * @param username The name of the organisation for which you want to be authorized.
     * @param tenant username of your profile
     * @param password password of your profile
     */
    private authRequst(username: String, tenant: String, password: String): Observable<Response> {
        const authString: String = btoa(`${username}@${tenant}:${password}`);
        const headers = new Headers();
        headers.append("Authorization", `Basic ${authString}`);
        headers.append("Accept", "application/*+xml;version=30.0");
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.post(`${this._baseUrl}/api/sessions`, null, opts);
    }

    /**
     * Execute authorization request.
     */
    public auth(): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            // Get the auth token from LS
            const authToken = window.localStorage.getItem('authtoken');
            // If any token
            if (authToken || authToken.length === 0) {
                this.setAuthToken(authToken);
                resolve(authToken)
                return;
            }

            console.log("NOT AUTHORIZED");
        });
        return promise;
    }
}