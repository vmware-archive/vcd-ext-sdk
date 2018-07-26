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

    public changeScope(plugins: Plugin[], scope: string[], url: string): Observable<Response> {
        return this.changeScopeForEach(plugins, scope, url);
    }

    private changeScopeForEach(plugins: Plugin[], scope: string[], url: string): Observable<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const updateProcesses: Observable<Response>[] = [];

        plugins.forEach((pluginToUpdate: Plugin) => {
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

            console.log(newPluginData, scope);
            

            updateProcesses.push(this.http
                .put(`${url}/cloudapi/extensions/ui/${pluginToUpdate.id}`, JSON.stringify(newPluginData), opts)
            );
        });

        return Observable.merge(...updateProcesses);
    }
}