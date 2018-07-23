import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Plugin } from "../interfaces/Plugin";
import { AuthService } from "./auth.service";
import { Organisation } from "../interfaces/Organisation";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { ChangeScopeService } from "./change-scope.service";

@Injectable()
export class PluginPublisher {
    constructor(
        private http: Http,
        private authService: AuthService,
        private changeScopeService: ChangeScopeService
    ) {}

    public enablePluginForAllTenants(plugins: Plugin[], url: string): Promise<Response | void | Response[]> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const setScopeProcesses: Promise<Response>[] = [];
        plugins.forEach((pluginToUpdate) => {
            setScopeProcesses.push(
                this.http.post(`${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/publishAll`, null, opts).toPromise()
            );
        });
        return Promise.all(setScopeProcesses);
    }

    public enablePluginForSpecificTenants(plugins: Plugin[], forOrgs: Organisation[], trackScope: boolean, url: string): { url: string, req: Observable<Response> }[] {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        // Collect promises
        const setScopeProcesses: { url: string, req: Observable<Response> }[] = [];

        // Loop through plugins
        plugins.forEach((pluginToUpdate) => {
            const body: { name: string }[] = [];

            // Assing org to req body
            forOrgs.forEach((org: Organisation) => {
                const obj = { name: org.name };
                body.push(obj);
            });

            // Create req url
            const REQ_URL = `${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/publish`;

            if (trackScope) {
                this.changeScopeService.addChangeScopeReq(new ChangeScopeRequest(REQ_URL, pluginToUpdate.pluginName));
            }

            // Create req and collect the promise
            setScopeProcesses.push({
                url: REQ_URL,
                req: this.http.post(REQ_URL, body, opts)
            })
        });

        return setScopeProcesses;
    }
}