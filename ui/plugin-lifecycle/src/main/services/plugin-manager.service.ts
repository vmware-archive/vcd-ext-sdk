import { Injectable, Inject } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs";
import { UploadPayload, ChangeScopePlugin } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { PluginUploaderService } from "./plugin-uploader.service";
import { PluginPublisher } from "./plugin-publisher.service";
import { HttpTransferService } from "@vcd/http-transfer-service";
import { API_ROOT_URL, AuthTokenHolderService } from "@vcd-ui/common";
import { UiPluginMetadataResponse, UiPluginMetadata } from "@vcd/bindings/vcloud/rest/openapi/model";
import { PluginService } from "./plugin.service";
import { getPropsWithout } from "../helpers/object-helpers";
import { HttpResponse } from "@angular/common/http";

@Injectable()
export class PluginManager {
    private _plugins: UiPluginMetadataResponse[];
    private _pluginsSubject = new BehaviorSubject<UiPluginMetadataResponse[]>(this._plugins);
    private _selectedPlugins: UiPluginMetadataResponse[] = [];
    private _selectedPluginsSubj = new BehaviorSubject<UiPluginMetadataResponse[]>(this.selectedPlugins);

    constructor(
        @Inject(API_ROOT_URL) private _baseUrl: string = "",
        private http: Http,
        private authService: AuthTokenHolderService,
        private pluginUploaderService: PluginUploaderService,
        private pluginPublisher: PluginPublisher,
        private httpTransferService: HttpTransferService,
        private pluginService: PluginService
    ) {
        this.getPluginsList();
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    set selectedPlugins(plugins: UiPluginMetadataResponse[]) {
        this._selectedPlugins = plugins;
        this._selectedPluginsSubj.next(this.selectedPlugins);
    }

    get selectedPlugins(): UiPluginMetadataResponse[] {
        return this._selectedPlugins;
    }

    public watchSelectedPlugins(): Observable<UiPluginMetadataResponse[]> {
        return this._selectedPluginsSubj.asObservable();
    }

    public getPlugins(): UiPluginMetadataResponse[] {
        return this._plugins;
    }

    public watchPluginList(): Observable<UiPluginMetadataResponse[]> {
        return this._pluginsSubject.asObservable();
    }

    /**
     * Disable list of plugins.
     * @param plugins list of plugins
     */
    public disablePlugins(): Observable<UiPluginMetadataResponse[]> {
        const disableProcesses: Observable<UiPluginMetadataResponse>[] = [];
        this.selectedPlugins.forEach((plugin) => {
            disableProcesses.push(
                this.pluginService.disablePlugin(plugin, plugin.id)
            );
        });

        return Observable.forkJoin(disableProcesses);
    }

    /**
     * Enable list of plugins.
     */
    public enablePlugins(): Observable<UiPluginMetadataResponse[]> {
        const enablePorcesses: Observable<UiPluginMetadataResponse>[] = [];
        this.selectedPlugins.forEach((plugin) => {
            enablePorcesses.push(
                this.pluginService.disablePlugin(plugin, plugin.id)
            );
        });

        return Observable.forkJoin(enablePorcesses);
    }

    /**
     * Delete list of plugins.
     */
    public deletePlugins(): Observable<Response[]> {
        const deleteProcesses: Observable<Response>[] = [];
        this.selectedPlugins.forEach((plugin) => {
            deleteProcesses.push(
                this.pluginService.deletePlugin(plugin)
            );
        });

        return Observable.forkJoin(deleteProcesses);
    }

    /**
     * Execute the change scope action.
     * @param plugins list of plugins
     * @param scope list of scopes / ['service-scope', 'tenant'] /
     */
    public changeScope(plugins: UiPluginMetadata[], scope: string[]): Observable<UiPluginMetadataResponse[]> {
        const changeScopePorcesses: Observable<UiPluginMetadataResponse>[] = [];
        plugins.forEach((plugin) => {
            const oneOfSelected = this.selectedPlugins.find((selected) => {
                return selected.pluginName === plugin.pluginName;
            });

            changeScopePorcesses.push(
                this.pluginService.changeScope(
                    plugin,
                    oneOfSelected.id,
                    {
                        serviceProvider: scope.indexOf("service-provider") !== -1,
                        tenant: scope.indexOf("tenant") !== -1
                    }
                )
            );
        });

        return Observable.forkJoin(changeScopePorcesses);
    }

    /**
     * Publish list of plugins.
     * @param trackScopeChange flag which determines requests like trackable
     */
    public publishPluginForAllTenants(trackScopeChange: boolean): Observable<HttpResponse<any>> {
        return this.pluginPublisher.publishPluginForAllTenants(this.selectedPlugins, this._baseUrl, trackScopeChange);
    }

    /**
     * Unpublish list of plugins.
     * @param trackScopeChange flag which determines requests like trackable
     */
    public unpublishPluginForAllTenants(trackScopeChange: boolean): Observable<HttpResponse<any>> {
        return this.pluginPublisher.unpublishPluginForAllTenants(this.selectedPlugins, this._baseUrl, trackScopeChange);
    }

    /**
     * Publish or unpublish list of plugins.
     */
    public handleMixedScope(plugins: ChangeScopePlugin[], scopeFeedback: ScopeFeedback, trackScopeChange: boolean): Observable<HttpResponse<any>> {
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
            this.pluginService
                .getPlugins()
                .toPromise()
                .then((res: UiPluginMetadataResponse[]) => {
                    this._plugins = res;
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
    public uploadPlugin(payload: UploadPayload, scopeFeedback: ScopeFeedback): Observable<Observable<HttpResponse<any>>> {
        // Create data used to register it
        const PLUGIN: any = {
            id: null,
            file: null
        };

        const observable = new Observable<Observable<HttpResponse<any>>>((observer) => {
            // Extract useful data from the manifest
            this.pluginUploaderService.proccessManifest(payload.manifest)
                .then((pluginDesc) => {
                    // Register plugin into the system
                    return this.pluginService.createSync<UiPluginMetadataResponse>(pluginDesc).toPromise();
                })
                .then((res: UiPluginMetadataResponse) => {;
                    PLUGIN.id = res.id;
                    PLUGIN.file = payload.file;
                    // Register the plugin name and size
                    return this.pluginUploaderService.enablePluginUpload(PLUGIN, this._baseUrl);
                })
                .then((enableResponse: HttpResponse<any>) => {
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
                        observer.next(this.pluginPublisher.publishPluginForAllTenants(
                            [PLUGIN],
                            this.baseUrl,
                            false
                        ));
                        return;
                    }

                    if (scopeFeedback.data.length > 0) {
                        observer.next(this.handleMixedScope(
                            [{ id: PLUGIN.id, pluginName: payload.manifest.name }],
                            scopeFeedback,
                            false
                        ));
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
