import { Injectable } from "@angular/core";
import { PluginManifest, PluginFileDetails } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";
import { UiPluginMetadata } from "@vcd/bindings/vcloud/rest/openapi/model";
import { VcdApiClient } from "@vcd/sdk";
import { HttpResponse } from "@angular/common/http";

@Injectable()
export class PluginUploaderService {
    constructor(
        private client: VcdApiClient
    ) {}

    /**
     * Extract useful data from the plugins manifest.
     * @param manifest parsed version of the plugins manifest
     */
    public proccessManifest(manifest: PluginManifest): Promise<UiPluginMetadata> {
        const promise = new Promise<UiPluginMetadata>((resolve, reject) => {
            // Validate the manifest
            const isValidManifest = PluginValidator.validateManifestFields(manifest);

            // If manifest is not valid
            if (!isValidManifest.success) {
                const reason = isValidManifest.errors[Object.keys(isValidManifest.errors)[0]];
                const error = new Error(`${isValidManifest.message} ${reason}`);
                reject(error);
                return;
            }

            resolve({
                "pluginName": manifest.name,
                "vendor": manifest.vendor,
                "description": manifest.description,
                "version": manifest.version,
                "license": manifest.license,
                "link": manifest.link,
                "tenant_scoped": manifest.scope.indexOf("tenant") !== -1,
                "provider_scoped": manifest.scope.indexOf("service-provider") !== -1,
                "enabled": true
            });
        });
        return promise;
    }

    /**
     * Enable plugin upload.
     * @param plugin specific plugin
     * @param url the base url where the request will be made
     */
    public enablePluginUpload(plugin: { id: string, file: File }, url: string): Promise<HttpResponse<any>> {
        // File size has to be in bytes
        const body: PluginFileDetails = {
            fileName: plugin.file.name,
            size: plugin.file.size
        };

        return this.client.createSyncWithObserveResponse<any>(`cloudapi/extensions/ui/${plugin.id}/plugin`, JSON.stringify(body)).toPromise();
    }
}
