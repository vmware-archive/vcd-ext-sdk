import { Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { EntityReference2 } from "@vcd/bindings/vcloud/rest/openapi/model";

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
    request: Observable<EntityReference2[]>;

    constructor(reqUrl: string, pluginName: string, action: string, req: Observable<EntityReference2[]>) {
        this.reqUrl = reqUrl;
        this.pluginName = pluginName;
        this.action = action;
        this.status = null;
        this.request = req;
    }
}
