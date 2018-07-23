import { Injectable } from "@angular/core";
import { Plugin, PluginDesc } from "../interfaces/Plugin";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { AuthService } from "./auth.service";

interface PluginUpdateOptions {
    tenant_scoped: boolean,
    provider_scoped: boolean,
    enabled: boolean
}

@Injectable()
export class DisableEnablePluginService {
    constructor(
        private http: Http,
        private authService: AuthService
    ) {}

    public disablePlugins(plugins: Plugin[], url: string): Promise<Response[]> {
        const options: PluginUpdateOptions = {
            tenant_scoped: null,
            provider_scoped: null,
            enabled: false
        }

        return this.updatePluginData(plugins, options, url);
    }

    public enablePlugins(plugins: Plugin[], url: string): Promise<Response[]> {
        const options: PluginUpdateOptions = {
            tenant_scoped: null,
            provider_scoped: null,
            enabled: true
        }

        return this.updatePluginData(plugins, options, url);
    }

    private updatePluginData(plugins: Plugin[], options: PluginUpdateOptions, url: string): Promise<Response[]> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const updateProcesses: Promise<Response>[] = [];

        plugins.forEach((pluginToUpdate: Plugin) => {
            const newPluginData: PluginDesc = {
                pluginName: pluginToUpdate.pluginName,
                vendor: pluginToUpdate.vendor,
                description: pluginToUpdate.description,
                version: pluginToUpdate.version,
                license: pluginToUpdate.license,
                link: pluginToUpdate.link,
                tenant_scoped: options.tenant_scoped !== null ? options.tenant_scoped : pluginToUpdate.tenant_scoped,
                provider_scoped: options.provider_scoped !== null ? options.provider_scoped : pluginToUpdate.provider_scoped,
                enabled: options.enabled !== null ? options.enabled : pluginToUpdate.enabled
            };

            updateProcesses.push(this.http
                .put(`${url}/cloudapi/extensions/ui/${pluginToUpdate.id}`, JSON.stringify(newPluginData), opts)
                .toPromise()
            );
        });

        return Promise
            .all(updateProcesses);
    }
}