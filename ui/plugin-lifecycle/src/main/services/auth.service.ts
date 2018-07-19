import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";


interface PluginUpdateOptions {
    tenant_scoped: boolean,
    provider_scoped: boolean,
    enabled: boolean
}

@Injectable()
export class AuthService {
    private _authToken: string;

    constructor(private http: Http) {}

    private setAuthToken(val: string): void {
        this._authToken = val;
    }

    public getAuthToken(): string {
        return this._authToken;
    }

    /**
     * Execute authorization request.
     */
    public auth(): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            const authToken = window.localStorage.getItem('authtoken');
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