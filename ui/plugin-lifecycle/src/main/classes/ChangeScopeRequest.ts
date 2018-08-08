import { Observable } from "rxjs";
import { Response } from "@angular/http";
import { HttpResponse } from "@angular/common/http";

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
    request: Observable<HttpResponse<any>>;

    constructor(reqUrl: string, pluginName: string, action: string, req: Observable<HttpResponse<any>>) {
        this.reqUrl = reqUrl;
        this.pluginName = pluginName;
        this.action = action;
        this.status = null;
        this.request = req;
    }
}
