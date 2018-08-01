export class ChangeScopeRequest {
    // Request url
    reqUrl: string;
    // Plugin name
    pluginName: string;
    // Status of the request
    status: boolean;
    // Request action
    action: string;

    constructor(reqUrl: string, pluginName: string, action: string) {
        this.reqUrl = reqUrl;
        this.pluginName = pluginName;
        this.action = action;
        this.status = null;
    }
}