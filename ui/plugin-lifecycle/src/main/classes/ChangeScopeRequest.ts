export class ChangeScopeRequest {
    reqUrl: string;
    pluginName: string;
    status: boolean;
    action: string;

    constructor(reqUrl: string, pluginName: string, action: string) {
        this.reqUrl = reqUrl;
        this.pluginName = pluginName;
        this.action = action;
        this.status = null;
    }
}