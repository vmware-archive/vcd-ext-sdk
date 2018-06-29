import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Plugin, ChangeScopePlugin } from "../interfaces/Plugin";
import { AuthService } from "./auth.service";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { ChangeOrgScopeService } from "./change-org-scope.service";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";
import { ChangeScopeRequestTo } from "../interfaces/ChangeScopeRequestTo";

@Injectable()
export class PluginPublisher {
    constructor(
        private http: Http,
        private authService: AuthService,
        private changeScopeService: ChangeOrgScopeService
    ) {}

    private togglePluginStateForAllTenants(plugins: Plugin[], url: string, hasToBe: string, trackScopeChange: boolean = false): ChangeScopeRequestTo[] {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const setScopeProcesses: ChangeScopeRequestTo[] = [];
        plugins.forEach((pluginToUpdate) => {
            const REQ_URL = `${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/${hasToBe}`;

            if (trackScopeChange) {
                this.changeScopeService.addChangeScopeReq(new ChangeScopeRequest(REQ_URL, pluginToUpdate.pluginName, `${hasToBe}`));
            }

            setScopeProcesses.push({
                url: REQ_URL,
                req: this.http.post(REQ_URL, null, opts)
            });
        });
        return setScopeProcesses;
    }

    private togglePluginStateForSpecTenants(plugin: Plugin, changeScopeItems: ChangeScopeItem[], trackScopeChange: boolean, url: string, hasToBe: string): ChangeScopeRequestTo {
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

        if (trackScopeChange) {
            this.changeScopeService.addChangeScopeReq(new ChangeScopeRequest(REQ_URL, plugin.pluginName ? plugin.pluginName : plugin.id, `${hasToBe}`));
        }

        return {
            url: REQ_URL,
            req: this.http.post(REQ_URL, body, opts)
        };
    }

    public publishPluginForAllTenants(plugins: Plugin[], url: string, trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.togglePluginStateForAllTenants(plugins, url, "publishAll", trackScopeChange);
    }

    public unpublishPluginForAllTenants(plugins: Plugin[], url: string, trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.togglePluginStateForAllTenants(plugins, url, "unpublishAll", trackScopeChange);
    }

    public handleMixedScope(plugins: ChangeScopePlugin[], scopeFeedback: ScopeFeedback, trackScopeChange: boolean, url: string): ChangeScopeRequestTo[] {
        const result: { url: string, req: Observable<Response> }[] = [];

        plugins.forEach((selectedPlugin: Plugin) => {
            const changeScopeItems = scopeFeedback.data.filter((el) => {
                return selectedPlugin.pluginName === el.plugin;
            });

            const toBePublished = changeScopeItems.filter((item) => {
                return item.action === 'publish';
            });

            const toBeUnpublishd = changeScopeItems.filter((item) => {
                return item.action === 'unpublish';
            });

            if (toBePublished.length > 0) {
                result.push(this.togglePluginStateForSpecTenants(selectedPlugin, toBePublished, trackScopeChange, url, 'publish'));
            }

            if (toBeUnpublishd.length > 0) {
                result.push(this.togglePluginStateForSpecTenants(selectedPlugin, toBeUnpublishd, trackScopeChange, url, 'unpublish'));
            }            
        });

        return result;
    }
}