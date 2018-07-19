import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable, Subject } from "rxjs";
import { Plugin, PluginManifest, PluginDesc, PluginFileDetails, UploadPayload } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";


interface PluginUpdateOptions {
    tenant_scoped: boolean,
    provider_scoped: boolean,
    enabled: boolean
}

@Injectable()
export class AuthService {
    private _baseUrl = "https://bos1-vcd-sp-static-200-117.eng.vmware.com";
    private _authToken: string;

    constructor(private http: Http) {}

    private setAuthToken(val: string): void {
        this._authToken = val;
    }

    public getAuthToken(): string {
        return this._authToken;
    }

    private authRequst(username: String, tenant: String, password: String): Observable<Response> {
        const authString: String = btoa(`${username}@${tenant}:${password}`);
        const headers = new Headers();
        headers.append("Authorization", `Basic ${authString}`);
        headers.append("Accept", "application/*+xml;version=30.0");
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.post(`${this._baseUrl}/api/sessions`, null, opts);
    }

    public auth(): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            return this.authRequst("administrator", "System", "ca$hc0w").toPromise()
                .then((res: Response) => {
                    // Set auth token here...
                    const authToken = res.headers.get("x-vcloud-authorization")
                    this.setAuthToken(authToken);
                    resolve(authToken);
                })
                .catch((err) => {
                    reject(err);
                });
        });
        return promise;
    }
}