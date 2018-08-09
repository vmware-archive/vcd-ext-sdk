import { Observable } from "rxjs";
import { Response } from "@angular/http";

export class ChangeScopeRequest {
    // Request url
    reqUrl: string;
    // Plugin name
    pluginName: string;
    // Status of the request
    status: boolean;
    // Request action
    action: string;
    // Http request
    request: Observable<Response>;

    constructor(reqUrl: string, pluginName: string, action: string, req: Observable<Response>) {
        this.reqUrl = reqUrl;
        this.pluginName = pluginName;
        this.action = action;
        this.status = null;
        this.request = req;
    }
}
