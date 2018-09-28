import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { ChangeScopePlugin } from "../interfaces/Plugin";
import { ChangeScopeRequest } from "../classes/ChangeScopeRequest";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { ChangeScopeItem } from "../interfaces/ChangeScopeItem";
import { UiPluginMetadataResponse, EntityReference2 } from "@vcd/bindings/vcloud/rest/openapi/model";
import { PluginService } from "./plugin.service";
import { API_ROOT_URL } from "@vcd/sdk/common";

@Injectable()
export class PluginPublisher {
    constructor(
        @Inject(API_ROOT_URL) private _baseUrl: string = "",
        private pluginService: PluginService
    ) {}

    /**
     * Toggle the publish state of a plugin for all organisations.
     * @param plugins list of plugins
     * @param hasToBe string value which says "published" or "unpublished"
     * @param trackScopeChange determinate will this request be tracked
     */
    private generatePublishRequestForAllTenants(
        plugins: UiPluginMetadataResponse[], hasToBe: string, trackScopeChange: boolean = false
    ): Observable<EntityReference2[]> {
        // Register change scope list
        let changeScopeRequests: ChangeScopeRequest[];

        // If the requests are not trackable create list for them
        if (!trackScopeChange) {
            changeScopeRequests = [];
        }

        // Loop throught the plugins list
        plugins.forEach((pluginToUpdate) => {
            // Create request url
            const REQ_URL = `${this._baseUrl}/cloudapi/extensions/ui/${pluginToUpdate.id}/tenants/${hasToBe}`;
            const REQ = this.pluginService.togglePublishing(pluginToUpdate.id, hasToBe, null);

            // Init change scope request object
            const changeScopeRequest = new ChangeScopeRequest(
                REQ_URL,
                pluginToUpdate.pluginName,
                hasToBe,
                REQ
            );

            changeScopeRequests.push(changeScopeRequest);
        });

        // Execute all in parrallel
        return Observable.merge(...changeScopeRequests.map((req) => req.request));
    }

    /**
     * Toggle the state of the plugins for specific tenants.
     * @param plugin list of plugins
     * @param changeScopeItems list of elements which describes what to do with specific plugin
     * @param trackScopeChange determinate will this request be tracked
     * @param hasToBe value which determitate thas is this "publis" or "unpublish" action
     */
    private generatePublishRequest(
        plugin: ChangeScopePlugin,
        changeScopeItems: ChangeScopeItem[],
        trackScopeChange: boolean,
        hasToBe: string
    ) {
        const body: { name: string }[] = [];

        // Assing org to req body
        changeScopeItems.forEach((item: ChangeScopeItem) => {
            body.push({ name: item.orgName });
        });

        // Create req url
        const REQ_URL = `${this._baseUrl}/cloudapi/extensions/ui/${plugin.id}/tenants/${hasToBe}`;
        const REQ = this.pluginService.togglePublishing(plugin.id, hasToBe, body);

        // Init change scope request object
        const changeScopeRequest = new ChangeScopeRequest(
            REQ_URL,
            plugin.pluginName,
            hasToBe,
            REQ
        );

        return changeScopeRequest;
    }

    /**
     * Publish the list of plugins for all tenants
     * @param plugins list of plugins
     * @param trackScopeChange determinate will this request be tracked
     */
    public publishPluginForAllTenants(
        plugins: UiPluginMetadataResponse[],
        trackScopeChange: boolean
    ): Observable<EntityReference2[]> {
        return this.generatePublishRequestForAllTenants(plugins, "publishAll", trackScopeChange);
    }

    /**
     * Unpublish the list of plugins for all tenants
     * @param plugins list of plugins
     * @param trackScopeChange determinate will this request be tracked
     */
    public unpublishPluginForAllTenants(
        plugins: UiPluginMetadataResponse[],
        trackScopeChange: boolean
    ): Observable<EntityReference2[]> {
        return this.generatePublishRequestForAllTenants(plugins, "unpublishAll", trackScopeChange);
    }

    /**
     * Publish or unpublish the list of plugins for specific tenants.
     * @param plugins list of plugins
     * @param url the base url where the request will be made
     * @param trackScopeChange determinate will this request be tracked
     * @param scopeFeedback contains the data which will be applied on each plugin into the list
     */
    public handleMixedScope(
        plugins: ChangeScopePlugin[],
        scopeFeedback: ScopeFeedback,
        trackScopeChange: boolean
    ): Observable<EntityReference2[]> {
        // Create the result object with the url of the request and the request
        const result: ChangeScopeRequest[] = [];

        plugins.forEach((selectedPlugin: UiPluginMetadataResponse) => {
            // Extract the data for this plugin only from scope feedback
            const changeScopeItems = scopeFeedback.data.filter((el) => {
                return selectedPlugin.pluginName === el.plugin.pluginName;
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
                result.push(this.generatePublishRequest(selectedPlugin, toBePublished, trackScopeChange, "publish"));
            }

            if (toBeUnpublishd.length > 0) {
                result.push(this.generatePublishRequest(selectedPlugin, toBeUnpublishd, trackScopeChange, "unpublish"));
            }
        });

        return Observable.merge(...result.map(item => item.request));
    }
}
