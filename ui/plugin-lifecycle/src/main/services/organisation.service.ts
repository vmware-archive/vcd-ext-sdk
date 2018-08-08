import { Injectable } from "@angular/core";
import { Tenant, UiTenantResponse } from "../interfaces/Tenant";
import { Observable, BehaviorSubject } from "rxjs";
import { PluginManager } from "./plugin-manager.service";
import { AuthTokenHolderService } from "@vcd-ui/common";
import { VcdApiClient } from "@vcd/sdk";

@Injectable()
export class OrganisationService {
    private _orgs: Organisation[] = [];
    private _orgsSubject = new BehaviorSubject<Organisation[]>(this.orgs);

    constructor(
        private authService: AuthTokenHolderService,
        private pluginManager: PluginManager,
        private client: VcdApiClient
    ) {
        // Load the organisations
        this.loadOrgs(this.pluginManager.baseUrl);
    }

    get orgs(): Organisation[] {
        return this._orgs;
    }

    set orgs(orgs: Organisation[]) {
        this._orgs = orgs;
        this._orgsSubject.next(this.orgs);
    }

    /**
     * Add new organisation into the list.
     * @param org organisation which will be added into the list
     */
    private addOrg(org: Organisation) {
        Object.keys(org).forEach((key) => {
            try {
                org[key] = JSON.parse(org[key]);
            } catch (error) {
                org[key] = org[key];
            }
        });

        this.orgs.push(org);
        this._orgsSubject.next(this.orgs);
    }

    /**
     * Observe the list of organisations.
     */
    public watchOrgs(): Observable<Organisation[]> {
        return this._orgsSubject.asObservable();
    }

    /**
     * Refresh the list of organisations.
     */
    public refresh() {
        this.loadOrgs(this.pluginManager.baseUrl);
    }

    /**
     * Make request to take all existing organistaions.
     */
    private loadOrgs(url: string): void {
        this.getAllTenants(url, this.authService.token)
            .then((res: UiTenantResponse) => {
                this.orgs = res.record;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Creates a request to take all organisations.
     * @param baseUrl the url where the request will be made
     * @param token the authorization token
     */
    private getAllTenants(baseUrl: string, token: string): Promise<UiTenantResponse> {
        return this.client.get<UiTenantResponse>("api/query?type=organization").toPromise();
    }
}
