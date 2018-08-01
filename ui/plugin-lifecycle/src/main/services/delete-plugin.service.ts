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

    /**
     * Delete list of plugins.
     * @param plugins list of plugins to be deleted
     * @param url base url where will be made the request
     */
    public deletePlugins(plugins: Plugin[], url: string): Promise<Response[]> {
        // Create headers
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        // Collect all delete processes
        const deleteProcesses: Promise<Response>[] = [];

        // Add each request into the list
        plugins.forEach((pluginToDelete: Plugin) => {
            deleteProcesses.push(this.http.delete(`${url}/cloudapi/extensions/ui/${pluginToDelete.id}`, opts).toPromise());
        });

        // Execute all requests in parallel
        return Promise
            .all(deleteProcesses);
    }
}