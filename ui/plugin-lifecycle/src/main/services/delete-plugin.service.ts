import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Plugin } from "../interfaces/Plugin";
import { AuthService } from "./auth.service";

@Injectable()
export class DeletePluginService {
    constructor(
        private http: Http,
        private authService: AuthService
    ) {}

    public deletePlugins(plugins: Plugin[], url: string): Promise<Response[]> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const deleteProcesses: Promise<Response>[] = [];
        plugins.forEach((pluginToDelete: Plugin) => {
            deleteProcesses.push(this.http.delete(`${url}/cloudapi/extensions/ui/${pluginToDelete.id}`, opts).toPromise());
        });

        return Promise
            .all(deleteProcesses);
    }
}