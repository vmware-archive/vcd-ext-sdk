export class ChangeScopeRequest {
    reqUrl: string;
    pluginName: string;
    status: boolean;

    constructor(reqUrl: string, pluginName: string) {
        this.reqUrl = reqUrl;
        this.pluginName = pluginName;
        this.status = null;
    }
}