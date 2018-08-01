import { Injectable } from "@angular/core";
import { Plugin, PluginDesc } from "../interfaces/Plugin";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

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

    /**
     * Disable list of plugins.
     * @param plugins list of plugins which will be disabled
     * @param url the base url where the request will be made
     */
    public disablePlugins(plugins: Plugin[], url: string): Promise<Response[]> {
        const options: PluginUpdateOptions = {
            tenant_scoped: null,
            provider_scoped: null,
            enabled: false
        }

        // Start update process
        return this.updatePluginData(plugins, options, url);
    }

    /**
     * Enable list of plugins
     * @param plugins list of plugins which will be disabled
     * @param url the base url where the request will be made
     */
    public enablePlugins(plugins: Plugin[], url: string): Promise<Response[]> {
        const options: PluginUpdateOptions = {
            tenant_scoped: null,
            provider_scoped: null,
            enabled: true
        }

        // Start update process
        return this.updatePluginData(plugins, options, url);
    }

    /**
     * Gets a list of plugins and update them with data provided in options parameter.
     * @param plugins list of plugins
     * @param options options which will be applied for each plugin
     * @param url the base url where will be makde the request
     */
    private updatePluginData(plugins: Plugin[], options: PluginUpdateOptions, url: string): Promise<Response[]> {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        // Collect the processes
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

            // Add each process into the list
            updateProcesses.push(this.http
                .put(`${url}/cloudapi/extensions/ui/${pluginToUpdate.id}`, JSON.stringify(newPluginData), opts)
                .toPromise()
            );
        });

        // Start all requests in parallel
        return Promise
            .all(updateProcesses);
    }
}