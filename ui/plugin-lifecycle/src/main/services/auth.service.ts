import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {
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