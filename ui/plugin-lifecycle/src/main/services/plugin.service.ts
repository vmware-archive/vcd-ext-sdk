import { Injectable } from "@angular/core";
import { VcdApiClient } from "@vcd/sdk";
import { Observable } from "rxjs";
import { UiPluginMetadata, UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model";
import { HttpResponse } from "@angular/common/http";

@Injectable()
export class PluginService {
    constructor(private client: VcdApiClient) {}

    public getPlugins(): Observable<UiPluginMetadataResponse[]> {
        return this.client.get("cloudapi/extensions/ui/");
    }

    public createSync<T>(item: T): Observable<T> {
        return this.client.createSync<T>("cloudapi/extensions/ui", item);
    }

    public deletePlugin(plugin: UiPluginMetadataResponse): Observable<any> {
        return this.client.deleteSync(`cloudapi/extensions/ui/${plugin.id}`);
    }

    public disablePlugin(plugin: UiPluginMetadata, id: string): Observable<UiPluginMetadataResponse> {
        plugin.enabled = false;
        return this.client.updateSync(`cloudapi/extensions/ui/${id}`, plugin);
    }

    public enablePlugin(plugin: UiPluginMetadata, id: string): Observable<UiPluginMetadataResponse> {
        plugin.enabled = true;
        return this.client.updateSync(`cloudapi/extensions/ui/${id}`, plugin);
    }

    public togglePublishing(pluginID: string, hasToBe: string, body: any): Observable<HttpResponse<any>> {
        return this.client.createSyncWithObserveResponse(`cloudapi/extensions/ui/${pluginID}/tenants/${hasToBe}`, body);
    }

    public changeScope(
        plugin: UiPluginMetadata,
        id: string,
        scope: { serviceProvider?: boolean, tenant?: boolean }
    ): Observable<UiPluginMetadataResponse> {
        plugin.provider_scoped = scope.serviceProvider;
        plugin.tenant_scoped = scope.tenant;

        return this.client.updateSync(`cloudapi/extensions/ui/${id}`, plugin);
    }
}
