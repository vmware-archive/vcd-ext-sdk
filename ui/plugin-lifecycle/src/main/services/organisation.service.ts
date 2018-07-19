import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Organisation } from "../interfaces/Organisation";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { AuthService } from "./auth.service";
import { XMLHelper } from "../classes/XMLHelper";

@Injectable()
export class OrganisationService {
    private _orgs: Organisation[] = [];
    private _orgsSubject = new BehaviorSubject<Organisation[]>(this.orgs);

    constructor(
        private http: Http,
        private authService: AuthService
    ) {
        this.authService.auth()
            .then(() => {
                this.loadOrgs();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    get orgs(): Organisation[] {
        return this._orgs;
    }

    set orgs(orgs: Organisation[]) {
        this._orgs = orgs;
    }

    private addOrg(org: Organisation) {
        Object.keys(org).forEach((key) => {
            try {
                org[key] = JSON.parse(org[key])
            } catch (error) {
                org[key] = org[key]
            }
        });

        this.orgs.push(org);
        this._orgsSubject.next(this.orgs);
    }

    public watchOrgs(): Observable<Organisation[]> {
        return this._orgsSubject.asObservable();
    }

    public refresh() {
        this.loadOrgs();
    }

    private loadOrgs(): void {
        this.getAllOrganisations("https://bos1-vcd-sp-static-200-117.eng.vmware.com", this.authService.getAuthToken())
            .then((res: Response) => {
                const parser = new DOMParser();
                const XML = parser.parseFromString(res.text(), "text/xml");
                const data: any = XMLHelper.xmlToJson(XML);
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

    private getAllOrganisations(baseUrl: string, token: string): Promise<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/*+xml;version=31.0");
        headers.append("x-vcloud-authorization", token);
        const opts = new RequestOptions();
        opts.headers = headers;

        return this.http.get(`${baseUrl}/api/query?type=organization`, opts).toPromise();
    }
}