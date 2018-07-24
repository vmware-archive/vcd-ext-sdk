import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Plugin } from "../interfaces/Plugin";
import { AuthService } from "./auth.service";
import { Organisation } from "../interfaces/Organisation";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { ChangeScopeService } from "./change-scope.service";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { forEach } from "@angular/router/src/utils/collection";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";

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

    private togglePluginStateForSpecTenants(plugin: Plugin, changeScopeItems: ChangeScopeItem[], trackScope: boolean, url: string, hasToBe: string): { url: string, req: Observable<Response> } {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const body: { name: string }[] = [];

        // Assing org to req body
        changeScopeItems.forEach((item: ChangeScopeItem) => {
            const obj = { name: item.orgName };
            body.push(obj);
        });

        // Create req url
        const REQ_URL = `${url}/cloudapi/extensions/ui/${plugin.id}/tenants/${hasToBe}`;

        if (trackScope) {
            this.changeScopeService.addChangeScopeReq(new ChangeScopeRequest(REQ_URL, plugin.pluginName, `${hasToBe}`));
        }

        // Create req and collect the promise
        return {
            url: REQ_URL,
            req: this.http.post(REQ_URL, body, opts)
        };
    }

    public publishPluginForAllTenants(plugins: Plugin[], url: string): Promise<Response | void | Response[]> {
        return this.togglePluginStateForAllTenants(plugins, url, true);
    }

    public unpublishPluginForAllTenants(plugins: Plugin[], url: string): Promise<Response | void | Response[]> {
        return this.togglePluginStateForAllTenants(plugins, url, false);
    }

    public handleMixedScope(selectedPlugins: Plugin[], feedback: ScopeFeedback, trackScope: boolean, url: string): { url: string, req: Observable<Response> }[] {
        const result: { url: string, req: Observable<Response> }[] = [];

        selectedPlugins.forEach((selectedPlugin: Plugin) => {
            const changeScopeItems = feedback.data.filter((el) => {
                return selectedPlugin.id === el.plugin.id;
            });

            const toBePublished = changeScopeItems.filter((item) => {
                return item.action === 'publish';
            });

            const toBeUnpublishd = changeScopeItems.filter((item) => {
                return item.action === 'unpublish';
            });

            if (toBePublished.length > 0) {
                result.push(this.togglePluginStateForSpecTenants(selectedPlugin, toBePublished, trackScope, url, 'publish'));
            }

            if (toBeUnpublishd.length > 0) {
                result.push(this.togglePluginStateForSpecTenants(selectedPlugin, toBeUnpublishd, trackScope, url, 'unpublish'));
            }            
        });

        return result;
    }
}