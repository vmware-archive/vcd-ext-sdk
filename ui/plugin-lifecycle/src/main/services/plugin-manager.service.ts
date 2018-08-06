import { Injectable, Inject } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Plugin, UploadPayload, ChangeScopePlugin } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { DisableEnablePluginService } from "./disable-enable-plugin.service";
import { PluginUploaderService } from "./plugin-uploader.service";
import { DeletePluginService } from "./delete-plugin.service";
import { PluginPublisher } from "./plugin-publisher.service";
import { ChangeScopeRequestTo } from "../interfaces/ChangeScopeRequestTo";
import {HttpTransferService} from "@vcd/http-transfer-service";
import { API_ROOT_URL, AuthTokenHolderService } from "@vcd-ui/common";

@Injectable()
export class PluginManager {
    private _plugins: Plugin[];
    private _pluginsSubject = new BehaviorSubject<Plugin[]>(this._plugins);
    private _selectedPlugins: Plugin[] = [];
    private _selectedPluginsSubj = new BehaviorSubject<Plugin[]>(this.selectedPlugins);

    constructor(
        @Inject(API_ROOT_URL) private _baseUrl: string = "",
        private http: Http,
        private authService: AuthTokenHolderService ,
        private disableEnablePlugin: DisableEnablePluginService,
        private pluginUploaderService: PluginUploaderService,
        private deletePluginService: DeletePluginService,
        private pluginPublisher: PluginPublisher,
        private httpTransferService: HttpTransferService
    ) {
        this.getPluginsList();
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    set selectedPlugins(plugins: Plugin[]) {
        this._selectedPlugins = plugins;
        this._selectedPluginsSubj.next(this.selectedPlugins);
    }

    get selectedPlugins(): Plugin[] {
        return this._selectedPlugins;
    }

    public watchSelectedPlugins(): Observable<Plugin[]> {
        return this._selectedPluginsSubj.asObservable();
    }

    public getPlugins(): Plugin[] {
        return this._plugins;
    }

    public watchPluginList(): Observable<Plugin[]> {
        return this._pluginsSubject.asObservable();
    }

    /**
     * Creates a request for all plugins.
     */
    public reqPlugins(): Observable<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("x-vcloud-authorization", this.authService.token);
        const opts = new RequestOptions();
        opts.headers = headers;
        return this.http.get(`${this._baseUrl}/cloudapi/extensions/ui`, opts);
    }

    /**
     * Disable list of plugins.
     * @param plugins list of plugins
     */
    public disablePlugins(): Promise<Response[]> {
        return this.disableEnablePlugin.disablePlugins(this.selectedPlugins, this._baseUrl);
    }

    /**
     * Enable list of plugins.
     * @param plugins list of plugins
     */
    public enablePlugins(): Promise<Response[]> {
        return this.disableEnablePlugin.enablePlugins(this.selectedPlugins, this._baseUrl);
    }

    /**
     * Delete list of plugins.
     * @param plugins list of plugins
     */
    public deletePlugins(): Promise<Response[]> {
        return this.deletePluginService.deletePlugins(this.selectedPlugins, this._baseUrl);
    }

    /**
     * Publish list of plugins.
     * @param plugins list of plugins
     * @param trackScopeChange flag which determines requests like trackable
     */
    public publishPluginForAllTenants(trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.pluginPublisher.publishPluginForAllTenants(this.selectedPlugins, this._baseUrl, trackScopeChange);
    }

    /**
     * Unpublish list of plugins.
     * @param plugins list of plugins
     * @param trackScopeChange flag which determines requests like trackable
     */
    public unpublishPluginForAllTenants(trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.pluginPublisher.unpublishPluginForAllTenants(this.selectedPlugins, this._baseUrl, trackScopeChange);
    }

    /**
     * Publish or unpublish list of plugins.
     */
    public handleMixedScope(plugins: ChangeScopePlugin[], scopeFeedback: ScopeFeedback, trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.pluginPublisher.handleMixedScope(plugins, scopeFeedback, trackScopeChange, this._baseUrl);
    }

    /**
     * Refresh the list of plugins.
     */
    public refresh(): Promise<void> {
        return this.getPluginsList();
    }

    /**
     * Check the list of plugins for duplications with provided plugin name.
     * @param pluginName name of the plugin.
     */
    public checkForDuplications(pluginName: string): Promise<boolean> {
        return PluginValidator.checkForDuplications(pluginName, this._plugins);
    }

    /**
     * Load the plugins.
     */
    private getPluginsList(): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.reqPlugins().toPromise()
                .then((res: Response) => {
                    this._plugins = res.json();
                    this._pluginsSubject.next(this._plugins);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
        return promise;
    }

    /**
     * Upload new plugin.
     * @param payload the data of the plugin
     * @param scopeFeedback the data which describes the scope of the plugin which will be uploaded
     */
    public uploadPlugin(payload: UploadPayload, scopeFeedback: ScopeFeedback): Observable<ChangeScopeRequestTo[]> {
        // Create data used to register it
        const PLUGIN: any = {
            id: null,
            file: null
        };

        const observable = new Observable<ChangeScopeRequestTo[]>((observer) => {
            // Extract useful data from the manifest
            this.pluginUploaderService.proccessManifest(payload.manifest)
            .then((pluginDesc) => {
                // Create headers
                const headers = new Headers();
                headers.append("Accept", "application/json");
                headers.append("Content-Type", "application/json");
                headers.append("x-vcloud-authorization", this.authService.token);
                const opts = new RequestOptions();
                opts.headers = headers;

                // Register plugin into the system
                return this.http.post(`${this._baseUrl}/cloudapi/extensions/ui`, pluginDesc, opts).toPromise();
            })
            .then((registerPluginResponse: Response) => {
                // Validate and Handle success
                const RES = registerPluginResponse.json();
                PLUGIN.id = RES.id;
                PLUGIN.file = payload.file;
                // Register the plugin name and size
                return this.pluginUploaderService.enablePluginUpload(PLUGIN, this._baseUrl);
            })
            .then((enableResponse: Response) => {
                // Send transfer link in the reslove where the plugin will be uploaded.
                const linkHeader: string = enableResponse.headers.get("Link");
                const url: string = linkHeader.split(">;")[0];
                const transferLink = url.slice(1, url.length);

                const headers = {
                    "x-vcloud-authorization": this.authService.token
                };

                // Upload the plugin chunk by chunk
                return this.httpTransferService.upload(headers, { file: payload.file, url: transferLink }).toPromise();
            })
            .then(() => {
                // Publish the plugin if this kind of data is provided
                if (scopeFeedback.forAllOrgs) {
                    observer.next(this.pluginPublisher.publishPluginForAllTenants([PLUGIN], this.baseUrl, false));
                    return;
                }

                if (scopeFeedback.data.length > 0) {
                    const publishFor = this.handleMixedScope([{ id: PLUGIN.id, pluginName: payload.manifest.name }], scopeFeedback, false);
                    observer.next(publishFor);
                    return;
                }

                observer.next();
            })
            .catch(err => {
                observer.error(err);
            });
        });

        return observable;
    }
}
