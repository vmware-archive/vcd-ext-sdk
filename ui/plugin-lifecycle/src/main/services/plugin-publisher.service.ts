import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Plugin, ChangeScopePlugin } from "../interfaces/Plugin";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { ChangeOrgScopeService } from "./change-org-scope.service";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";
import { ChangeScopeRequestTo } from "../interfaces/ChangeScopeRequestTo";
import { AuthTokenHolderService } from "@vcd-ui/common";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model";

@Injectable()
export class PluginPublisher {
    constructor(
        private http: Http,
        private authService: AuthTokenHolderService,
        private changeOrgScopeService: ChangeOrgScopeService
    ) {}

    /**
     * Toggle the publish state of a plugin for all organistaions.
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param hasToBe string value which says "published" or "unpublished"
     * @param trackScopeChange determinate will this request be tracked
     */
    private togglePluginStateForAllTenants(
        plugins: UiPluginMetadataResponse[], url: string, hasToBe: string, trackScopeChange: boolean = false
    ): ChangeScopeRequestTo[] {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.token);
        const opts = new RequestOptions();
        opts.headers = headers;

        // Collect the change scope processes
        const setScopeProcesses: ChangeScopeRequestTo[] = [];

        plugins.forEach((pluginToUpdate) => {
            // Create request url
            const REQ_URL = `${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/${hasToBe}`;

            // Track the request if needed
            if (trackScopeChange) {
                this.changeOrgScopeService.addChangeScopeReq(new ChangeScopeRequest(REQ_URL, pluginToUpdate.pluginName, `${hasToBe}`));
            }

            // Add the request into the list of processes
            setScopeProcesses.push({
                url: REQ_URL,
                req: this.http.post(REQ_URL, null, opts)
            });
        });
        return setScopeProcesses;
    }

    /**
     * Toggle the state of the plugins for specific tenants.
     * @param plugin list of plugins
     * @param changeScopeItems list of elements which describes what to do with specific plugin
     * @param trackScopeChange determinate will this request be tracked
     * @param url the base url where the request will be made
     * @param hasToBe value which determitate thas is this "publis" or "unpublish" action
     */
    private togglePluginStateForSpecTenants(
        plugin: ChangeScopePlugin, changeScopeItems: ChangeScopeItem[], trackScopeChange: boolean, url: string, hasToBe: string
    ): ChangeScopeRequestTo {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.token);
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

        // Track the request if needed
        if (trackScopeChange) {
            this.changeOrgScopeService.addChangeScopeReq(
                new ChangeScopeRequest(REQ_URL, plugin.pluginName ? plugin.pluginName : plugin.id, `${hasToBe}`)
            );
        }

        return {
            url: REQ_URL,
            req: this.http.post(REQ_URL, body, opts)
        };
    }

    /**
     * Publish the list of plugins for all tenants
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param trackScopeChange determinate will this request be tracked
     */
    public publishPluginForAllTenants(plugins: UiPluginMetadataResponse[], url: string, trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.togglePluginStateForAllTenants(plugins, url, "publishAll", trackScopeChange);
    }

    /**
     * Unpublish the list of plugins for all tenants
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param trackScopeChange determinate will this request be tracked
     */
    public unpublishPluginForAllTenants(plugins: UiPluginMetadataResponse[], url: string, trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.togglePluginStateForAllTenants(plugins, url, "unpublishAll", trackScopeChange);
    }

    /**
     * Publish or unpublish the list of plugins for specific tenants.
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param trackScopeChange determinate will this request be tracked
     * @param scopeFeedback contains the data which will be applied on each plugin into the list
     */
    public handleMixedScope(
        plugins: ChangeScopePlugin[], scopeFeedback: ScopeFeedback, trackScopeChange: boolean, url: string
    ): ChangeScopeRequestTo[] {
        // Create the result object with the url of the request and the request
        const result: { url: string, req: Observable<Response> }[] = [];

        plugins.forEach((selectedPlugin: ChangeScopePlugin) => {
            // Extract the data for this plugin only from scope feedback
            const changeScopeItems = scopeFeedback.data.filter((el) => {
                return selectedPlugin.pluginName === el.plugin;
            });

            // Extract data for publishing
            const toBePublished = changeScopeItems.filter((item) => {
                return item.action === "publish";
            });

            // Extract data for unpublishing
            const toBeUnpublishd = changeScopeItems.filter((item) => {
                return item.action === "unpublish";
            });

            // Add requests into the list if any
            if (toBePublished.length > 0) {
                result.push(this.togglePluginStateForSpecTenants(selectedPlugin, toBePublished, trackScopeChange, url, "publish"));
            }

            if (toBeUnpublishd.length > 0) {
                result.push(this.togglePluginStateForSpecTenants(selectedPlugin, toBeUnpublishd, trackScopeChange, url, "unpublish"));
            }
        });

        return result;
    }
}
