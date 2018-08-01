import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Plugin, PluginDesc } from "../interfaces/Plugin";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class ChangeScopeService {
    constructor(
        private http: Http,
        private authService: AuthService
    ) {}

    /**
     * Execute the change scope action.
     * @param plugins list of plugins
     * @param scope list of scopes / ['service-scope', 'tenant'] /
     * @param url the base url where will be made the request
     */
    public changeScope(plugins: Plugin[], scope: string[], url: string): Observable<Response> {
        return this.changeScopeForEach(plugins, scope, url);
    }

    /**
     * Change the scope for each plugin into the list.
     * @param plugins list of plugins
     * @param scope list of scopes / ['service-scope', 'tenant'] /
     * @param url the base url where will be made the request 
     */
    private changeScopeForEach(plugins: Plugin[], scope: string[], url: string): Observable<Response> {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        // Collect update processes
        const updateProcesses: Observable<Response>[] = [];

        // Loop through the list of plugins
        plugins.forEach((pluginToUpdate: Plugin) => {
            // Create new plugin payload
            const newPluginData: PluginDesc = {
                pluginName: pluginToUpdate.pluginName,
                vendor: pluginToUpdate.vendor,
                description: pluginToUpdate.description,
                version: pluginToUpdate.version,
                license: pluginToUpdate.license,
                link: pluginToUpdate.link,
                tenant_scoped: scope.indexOf("tenant") !== -1,
                provider_scoped: scope.indexOf("service-provider") !== -1,
                enabled: pluginToUpdate.enabled
            };            

            // Add the update request into the list of update requests
            updateProcesses.push(this.http
                .put(`${url}/cloudapi/extensions/ui/${pluginToUpdate.id}`, JSON.stringify(newPluginData), opts)
            );
        });

        // Merge all observables into one. They will be executed independantly.
        return Observable.merge(...updateProcesses);
    }
}