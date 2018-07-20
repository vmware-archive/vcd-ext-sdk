import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable, Subject } from "rxjs";
import { Plugin, PluginManifest, PluginDesc, PluginFileDetails, UploadPayload } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";
import { AuthService } from "./auth.service";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { Organisation } from "../interfaces/Organisation";
import { resolve } from "url";
import { OrganisationService } from "./organisation.service";

interface PluginUpdateOptions {
    tenant_scoped: boolean,
    provider_scoped: boolean,
    enabled: boolean
}

@Injectable()
export class PluginManager {
    private _baseUrl = "https://bos1-vcd-sp-static-200-117.eng.vmware.com";
    private _plugins: Plugin[];
    private _pluginsSubject = new Subject<Plugin[]>();

    constructor(
        private http: Http,
        private authService: AuthService,
        private orgService: OrganisationService) {
        this.authService.auth().then(() => {
            this.getPluginsList();
        });
    }

    public getPlugins(): Plugin[] {
        return this._plugins;
    }

    public watchPluginList(): Observable<Plugin[]> {
        return this._pluginsSubject.asObservable();
    }

    public reqPlugins(): Observable<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get(`${this._baseUrl}/cloudapi/extensions/ui`, opts);
    }

    public disablePlugins(plugins: Plugin[]): Promise<Response[]> {
        const options: PluginUpdateOptions = {
            tenant_scoped: null,
            provider_scoped: null,
            enabled: false
        }

        return this.updatePluginData(plugins, options);
    }

    public enablePlugins(plugins: Plugin[]): Promise<Response[]> {
        const options: PluginUpdateOptions = {
            tenant_scoped: null,
            provider_scoped: null,
            enabled: true
        }

        return this.updatePluginData(plugins, options);
    }

    public deletePlugins(plugins: Plugin[]): Promise<Response[]> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const deleteProcesses: Promise<Response>[] = [];
        plugins.forEach((pluginToDelete: Plugin) => {
            deleteProcesses.push(this.http.delete(`${this._baseUrl}/cloudapi/extensions/ui/${pluginToDelete.id}`, opts).toPromise());
        });

        return Promise
            .all(deleteProcesses);
    }

    public setPluginScopeFor(plugins: Plugin[], data: ScopeFeedback): Promise<Response[]> {
        const setScopeProcesses: Promise<Response>[] = [];
        if (data.forAllTenants) {
            plugins.forEach((pluginToUpdate) => {
                setScopeProcesses.push(
                    this.enablePluginForAllTenants(pluginToUpdate)
                );
            });
            return Promise.all(setScopeProcesses);
        }

        // Handle scope change for spec orgs.
    }

    private enablePluginForAllTenants(plugin: Plugin): Promise<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        return this.http.post(`${this._baseUrl}/cloudapi/extensions/ui/${plugin.id}/tenants/publishAll`, null, opts).toPromise();
    }

    private enablePluginForSpecificTenants(plugin: Plugin, forOrgs: Organisation[]): Promise<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("x-vcloud-authorization", this.authService.getAuthToken());
        const opts = new RequestOptions();
        opts.headers = headers;

        const body: any = [];

        return this.http.post(`${this._baseUrl}/cloudapi/extensions/ui/${plugin.id}/tenants/publishAll`, body, opts).toPromise();
    }

    public refresh(): Promise<void> {
        return this.getPluginsList();
    }

    public checkForDuplications(pluginName: string): Promise<boolean> {
        return PluginValidator.checkForDuplications(pluginName, this._plugins);
    }

    private updatePluginData(plugins: Plugin[], options: PluginUpdateOptions): Promise<Response[]> {
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
                .put(`${this._baseUrl}/cloudapi/extensions/ui/${pluginToUpdate.id}`, JSON.stringify(newPluginData), opts)
                .toPromise()
            );
        });

        return Promise
            .all(updateProcesses);
    }

    private getPluginsList(): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.reqPlugins().toPromise()
                .then((res: Response) => {
                    this._plugins = res.json();
                    this._pluginsSubject.next(this._plugins);
                    resolve();
                })
                .catch((err) => {
                    // Handle error.
                    reject(err);
                });
        });
        return promise;
    }

    private proccessManifest(manifest: PluginManifest): Promise<string> {
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
                "provider_scoped": manifest.scope.indexOf("provider") !== -1,
                "enabled": true
            });
            resolve(pluginDesc);
        });
        return promise;
    }

    private enablePluginUpload(plugin: { id: string, file: File }): Promise<Response> {
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

        return this.http.post(`${this._baseUrl}/cloudapi/extensions/ui/${plugin.id}/plugin`, JSON.stringify(body), opts).toPromise();
    }

    private sendZip(transferLink: string, file: File): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/zip");
            headers.append("x-vcloud-authorization", this.authService.getAuthToken());
            const opts = new RequestOptions();
            opts.headers = headers;

            this.http.put(transferLink, file, opts).toPromise()
                .then(() => {
                    // Handle upload
                    resolve();
                })
                .catch((err) => {
                    // Handle error
                    reject(err);
                });
        });
    }

    public uploadPlugin(payload: UploadPayload, pluginScope: ScopeFeedback): Promise<Response|void> {
        const PLUGIN: any = {
            id: null,
            file: null
        };

        return this.proccessManifest(payload.manifest)
            .then((pluginDesc) => {
                const headers = new Headers();
                headers.append("Accept", "application/json");
                headers.append("Content-Type", "application/json");
                headers.append("x-vcloud-authorization", this.authService.getAuthToken());
                // headers.append("Content-Type", "multipart/form-data");
                const opts = new RequestOptions();
                opts.headers = headers;

                return this.http.post(`${this._baseUrl}/cloudapi/extensions/ui`, pluginDesc, opts).toPromise();
            })
            .then((registerPluginResponse: Response) => {
                // Validate and Handle success
                const RES = registerPluginResponse.json();
                PLUGIN.id = RES.id;
                PLUGIN.file = payload.file;
                return this.enablePluginUpload(PLUGIN);
            })
            .then((enableResponse: Response) => {
                // Send transfer link in the reslove where the plugin will be uploaded.
                const linkHeader: string = enableResponse.headers.get("Link");
                const url: string = linkHeader.split(">;")[0];
                const transferLink = url.slice(1, url.length);
                return this.sendZip(transferLink, payload.file);
            })
            .then(() => {
                if (pluginScope.forAllTenants) {
                    return this.enablePluginForAllTenants(PLUGIN);
                }
                
                if (pluginScope.forTenant) {
                    return this.enablePluginForSpecificTenants(PLUGIN, pluginScope.orgs);
                }

                return new Promise<Response|void>((resolve) => {
                    resolve();
                });
            })
    }
}
