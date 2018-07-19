import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { PluginManifest, PluginFileDetails } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";
import { AuthService } from "./auth.service";

@Injectable()
export class PluginUploaderService {
    constructor(
        private http: Http,
        private authService: AuthService
    ) {}

    public proccessManifest(manifest: PluginManifest): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            const isValidManifest = PluginValidator.validateManifestFields(manifest);
            if (!isValidManifest.success) {
                const reason = isValidManifest.errors[Object.keys(isValidManifest.errors)[0]];
                const error = new Error(`${isValidManifest.message} ${reason}`);
                reject(error);
                return;
            }

            const pluginDesc: string = JSON.stringify({
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
            resolve(pluginDesc);
        });
        return promise;
    }

    public enablePluginUpload(plugin: { id: string, file: File }, url: string): Promise<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        // File size has to be in bytes
        const body: PluginFileDetails = {
            fileName: plugin.file.name,
            size: plugin.file.size
        };

        return this.http.post(`${url}/cloudapi/extensions/ui/${plugin.id}/plugin`, JSON.stringify(body), opts).toPromise();
    }

    public sendZip(transferLink: string, file: File): Promise<Response> {
        const headers = new Headers();
        headers.append("Content-Type", "application/zip");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        return this.http.put(transferLink, file, opts).toPromise();
    }
}