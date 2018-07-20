import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

@Injectable()
export class OrganisationService {
    
    constructor(private http: Http) {}
    
    public getAllOrganisations(baseUrl: string, token: string): Promise<Response> {
        const headers = new Headers();
        headers.append("Accept", "application/*+xml;version=31.0");
        headers.append("x-vcloud-authorization", token);
        const opts = new RequestOptions();
        opts.headers = headers;

        return this.http.get(`${baseUrl}/cloudapi/extensions/ui`, opts).toPromise();
    }
}