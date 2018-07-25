import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable, Subject } from "rxjs";
import { Plugin, UploadPayload, ChangeScopePlugin } from "../interfaces/Plugin";
import { PluginValidator } from "../classes/plugin-validator";
import { AuthService } from "./auth.service";
import { ScopeFeedback } from "../classes/ScopeFeedback";
import { Organisation } from "../interfaces/Organisation";
import { DisableEnablePluginService } from "./disable-enable-plugin.service";
import { PluginUploaderService } from "./plugin-uploader.service";
import { DeletePluginService } from "./delete-plugin.service";
import { PluginPublisher } from "./plugin-publisher.service";
import { ChangeScopeRequestTo } from "../interfaces/ChangeScopeRequestTo";

@Injectable()
export class PluginManager {
    private _baseUrl = "https://bos1-vcd-sp-static-200-117.eng.vmware.com";
    private _plugins: Plugin[];
    private _pluginsSubject = new Subject<Plugin[]>();
    
    private _selectedPlugins: Plugin[] = [];
    private _selectedPluginsSubj = new Subject<Plugin[]>();

    constructor(
        private http: Http,
        private authService: AuthService,
        private disableEnablePlugin: DisableEnablePluginService,
        private pluginUploaderService: PluginUploaderService,
        private deletePluginService: DeletePluginService,
        private pluginPublisher: PluginPublisher
    ) {
        this.authService.auth().then(() => {
            this.getPluginsList();
        });
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
        return this.disableEnablePlugin.disablePlugins(plugins, this._baseUrl);
    }

    public enablePlugins(plugins: Plugin[]): Promise<Response[]> {
        return this.disableEnablePlugin.enablePlugins(plugins, this._baseUrl);
    }

    public deletePlugins(plugins: Plugin[]): Promise<Response[]> {
        return this.deletePluginService.deletePlugins(plugins, this._baseUrl);
    }

    public publishPluginForAllTenants(plugins: Plugin[], trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.pluginPublisher.publishPluginForAllTenants(plugins ? plugins : this.selectedPlugins, this._baseUrl, trackScopeChange);
    }

    public unpublishPluginForAllTenants(plugins: Plugin[], trackScopeChange: boolean): ChangeScopeRequestTo[] {
        return this.pluginPublisher.unpublishPluginForAllTenants(plugins ? plugins : this.selectedPlugins, this._baseUrl, trackScopeChange);
    }

    public handleMixedScope(plugins: ChangeScopePlugin[], scopeFeedback: ScopeFeedback, trackScopeChange: boolean): { url: string, req: Observable<Response> }[] {
        return this.pluginPublisher.handleMixedScope(plugins, scopeFeedback, trackScopeChange, this._baseUrl);
    }

    public refresh(): Promise<void> {
        return this.getPluginsList();
    }

    public checkForDuplications(pluginName: string): Promise<boolean> {
        return PluginValidator.checkForDuplications(pluginName, this._plugins);
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

    public uploadPlugin(payload: UploadPayload, scopeFeedback: ScopeFeedback): Observable<ChangeScopeRequestTo[]> {
        const PLUGIN: any = {
            id: null,
            file: null
        };

        const observable = new Observable<ChangeScopeRequestTo[]>((observer) => {
            this.pluginUploaderService.proccessManifest(payload.manifest)
            .then((pluginDesc) => {
                const headers = new Headers();
                headers.append("Accept", "application/json");
                headers.append("Content-Type", "application/json");
                headers.append("x-vcloud-authorization", this.authService.getAuthToken());
                const opts = new RequestOptions();
                opts.headers = headers;

                return this.http.post(`${this._baseUrl}/cloudapi/extensions/ui`, pluginDesc, opts).toPromise();
            })
            .then((registerPluginResponse: Response) => {
                // Validate and Handle success
                const RES = registerPluginResponse.json();
                PLUGIN.id = RES.id;
                PLUGIN.file = payload.file;
                return this.pluginUploaderService.enablePluginUpload(PLUGIN, this._baseUrl);
            })
            .then((enableResponse: Response) => {
                // Send transfer link in the reslove where the plugin will be uploaded.
                const linkHeader: string = enableResponse.headers.get("Link");
                const url: string = linkHeader.split(">;")[0];
                const transferLink = url.slice(1, url.length);
                return this.pluginUploaderService.sendZip(transferLink, payload.file);
            })
            .then(() => {
                if (scopeFeedback.forAllOrgs && scopeFeedback.publishForAllTenants) {
                    observer.next(this.publishPluginForAllTenants([PLUGIN], false));
                    return
                }

                if (scopeFeedback.forAllOrgs && scopeFeedback.unpublishForAllTenants) {
                    observer.next(this.unpublishPluginForAllTenants([PLUGIN], false));
                    return
                }

                if (scopeFeedback.data.length > 0) {
                    const publishFor = this.handleMixedScope([{ id: PLUGIN.id, pluginName: payload.manifest.name }], scopeFeedback, false);
                    observer.next(publishFor);
                    return;
                }

                observer.next();
            });
        });

        return observable;
    }
}
