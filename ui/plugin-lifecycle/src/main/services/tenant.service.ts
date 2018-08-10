import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Tenant } from "../interfaces/Tenant";
import { Observable, BehaviorSubject } from "rxjs";
import { XMLHelper } from "../classes/XMLHelper";
import { PluginManager } from "./plugin-manager.service";
import { AuthTokenHolderService } from "@vcd-ui/common";

@Injectable()
export class TenantService {
    private _orgs: Tenant[] = [];
    private _orgsSubject = new BehaviorSubject<Tenant[]>(this.orgs);

    constructor(
        private http: Http,
        private authService: AuthTokenHolderService,
        private pluginManager: PluginManager
    ) {
        // Load the tenants
        this.loadOrgs(this.pluginManager.baseUrl);
    }

    get orgs(): Tenant[] {
        return this._orgs;
    }

    set orgs(orgs: Tenant[]) {
        this._orgs = orgs;
    }

    /**
     * Add new tenant into the list.
     * @param org tenant which will be added into the list
     */
    private addOrg(org: Tenant) {
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
     * Observe the list of tenants.
     */
    public watchOrgs(): Observable<Tenant[]> {
        return this._orgsSubject.asObservable();
    }

    /**
     * Refresh the list of tenants.
     */
    public refresh() {
        this.loadOrgs(this.pluginManager.baseUrl);
    }

    /**
     * Make request to take all existing organistaions.
     */
    private loadOrgs(url: string): void {
        this.getAllTenants(url, this.authService.token)
            .then((res: Response) => {
                // Parse the xml response
                const parser = new DOMParser();
                const XML = parser.parseFromString(res.text(), "text/xml");
                const data: any = XMLHelper.xmlToJson(XML);

                // If is array
                if (Array.isArray(data.QueryResultRecords.OrgRecord)) {
                    data.QueryResultRecords.OrgRecord.forEach((el: any) => {
                        this.addOrg(el["@attributes"]);
                    });
                } else {
                    this.addOrg(data.QueryResultRecords.OrgRecord["@attributes"]);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Creates a request to take all tenants.
     * @param baseUrl the url where the request will be made
     * @param token the authorization token
     */
    private getAllTenants(baseUrl: string, token: string): Promise<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/*+xml;version=31.0");
        headers.append("x-vcloud-authorization", token);
        const opts = new RequestOptions();
        opts.headers = headers;

        return this.http.get(`${baseUrl}/api/query?type=organization`, opts).toPromise();
    }
}
