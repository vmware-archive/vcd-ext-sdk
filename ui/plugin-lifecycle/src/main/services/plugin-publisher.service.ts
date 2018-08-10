import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChangeScopePlugin } from "../interfaces/Plugin";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { ChangeOrgScopeService } from "./change-org-scope.service";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";
import { AuthTokenHolderService } from "@vcd-ui/common";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model";
import { HttpResponse } from "@angular/common/http";
import { PluginService } from "./plugin.service";

@Injectable()
export class PluginPublisher {
    constructor(
        private authService: AuthTokenHolderService,
        private changeOrgScopeService: ChangeOrgScopeService,
        private pluginService: PluginService
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
    ): Observable<HttpResponse<any>> {
        // Register change scope list
        let changeScopeRequests: ChangeScopeRequest[];

        // If the requests are not trackable create list for them
        if (!trackScopeChange) {
            changeScopeRequests = [];
        }

        // Loop throught the plugins list
        plugins.forEach((pluginToUpdate) => {
            // Create request url
            const REQ_URL = `${url}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/${hasToBe}`;
            const REQ = this.pluginService.togglePublishing(pluginToUpdate.id, hasToBe, null);

            // Init change scope request object
            const changeScopeRequest = new ChangeScopeRequest(
                REQ_URL,
                pluginToUpdate.pluginName,
                `${hasToBe}`,
                REQ
            );

            // Track the request if needed
            if (trackScopeChange) {
                // Add request to the list
                this.changeOrgScopeService.addChangeScopeReq(changeScopeRequest);
            } else {
                // Add request to the list
                changeScopeRequests.push(changeScopeRequest);
            }
        });

        // Execute all tracked requests in parallel with merge operator
        if (trackScopeChange) {
            return this.changeOrgScopeService.executeRequestsInParallel();
        }

        // Execute all in parrallel
        return Observable.merge(...changeScopeRequests.map((req) => req.request));
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
    ): Observable<HttpResponse<any>> {
        const body: { name: string }[] = [];

        // Assing org to req body
        changeScopeItems.forEach((item: ChangeScopeItem) => {
            body.push({ name: item.orgName });
        });

        // Create req url
        const REQ_URL = `${url}/cloudapi/extensions/ui/${plugin.id}/tenants/${hasToBe}`;
        const REQ = this.pluginService.togglePublishing(plugin.id, hasToBe, body);

        // Register change scope list
        let changeScopeRequests: ChangeScopeRequest[];

        // If the requests are not trackable create list for them
        if (!trackScopeChange) {
            changeScopeRequests = [];
        }

        // Init change scope request object
        const changeScopeRequest = new ChangeScopeRequest(
            REQ_URL,
            plugin.pluginName,
            `${hasToBe}`,
            REQ
        );

        // Track the request if needed
        if (trackScopeChange) {
            this.changeOrgScopeService.addChangeScopeReq(changeScopeRequest);
        } else {
            // Add request to the list
            changeScopeRequests.push(changeScopeRequest);
        }

        // Execute all tracked requests in parallel with merge operator
        if (trackScopeChange) {
            return this.changeOrgScopeService.executeRequestsInParallel();
        }

        // Execute all in parrallel
        return Observable.merge(...changeScopeRequests.map((req) => req.request));
    }

    /**
     * Publish the list of plugins for all tenants
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param trackScopeChange determinate will this request be tracked
     */
    public publishPluginForAllTenants(plugins: UiPluginMetadataResponse[], url: string, trackScopeChange: boolean): Observable<HttpResponse<any>> {
        return this.togglePluginStateForAllTenants(plugins, url, "publishAll", trackScopeChange);
    }

    /**
     * Unpublish the list of plugins for all tenants
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param trackScopeChange determinate will this request be tracked
     */
    public unpublishPluginForAllTenants(plugins: UiPluginMetadataResponse[], url: string, trackScopeChange: boolean): Observable<HttpResponse<any>> {
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
    ): Observable<HttpResponse<any>> {
        // Create the result object with the url of the request and the request
        const result: Observable<HttpResponse<any>>[] = [];

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

        return Observable.merge(...result);
    }
}
