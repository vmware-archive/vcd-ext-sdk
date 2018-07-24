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

    private togglePluginStateForAllTenants(plugins: Plugin[], url: string, publishAll: boolean): Promise<Response | void | Response[]> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const setScopeProcesses: Promise<Response>[] = [];
        plugins.forEach((pluginToUpdate) => {
            setScopeProcesses.push(
                this.http.post(`${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/${publishAll ? 'publishAll' : 'unpublishAll'}`, null, opts).toPromise()
            );
        });
        return Promise.all(setScopeProcesses);
    }

    private togglePluginStateForSpecTenants(plugins: Plugin[], forOrgs: Organisation[], trackScope: boolean, url: string, publish: boolean): { url: string, req: Observable<Response> }[] {
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
            const REQ_URL = `${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/${publish ? 'publish': 'unpublish'}`;

            if (trackScope) {
                this.changeScopeService.addChangeScopeReq(new ChangeScopeRequest(REQ_URL, pluginToUpdate.pluginName, `${publish ? 'publish': 'unpublish'}`));
            }

            // Create req and collect the promise
            setScopeProcesses.push({
                url: REQ_URL,
                req: this.http.post(REQ_URL, body, opts)
            })
        });

        return setScopeProcesses;
    }

    public publishPluginForAllTenants(plugins: Plugin[], url: string): Promise<Response | void | Response[]> {
        return this.togglePluginStateForAllTenants(plugins, url, true);
    }

    public publishPluginForSpecificTenants(plugins: Plugin[], forOrgs: Organisation[], trackScope: boolean, url: string): { url: string, req: Observable<Response> }[] {
        return this.togglePluginStateForSpecTenants(plugins, forOrgs, trackScope, url, true);
    }

    public unpublishPluginForAllTenants(plugins: Plugin[], url: string): Promise<Response | void | Response[]> {
        return this.togglePluginStateForAllTenants(plugins, url, false);
    }

    public unpublishPluginForSpecificTenants(plugins: Plugin[], forOrgs: Organisation[], trackScope: boolean, url: string): { url: string, req: Observable<Response> }[] {
        return this.togglePluginStateForSpecTenants(plugins, forOrgs, trackScope, url, false);
    }
}