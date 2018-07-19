import { ServerType } from "./ServerType";
export declare class VimServerType extends ServerType {
    isEnabled?: boolean;
    isConnected?: boolean;
    shieldManagerHost?: string;
    shieldManagerUserName?: string;
    uuid?: string;
    vcProxy?: string;
    vcVersion?: string;
    useVsphereService?: boolean;
    vsphereWebClientServerUrl?: string;
}
export declare namespace VimServerType {
    class Fields extends ServerType.Fields {
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_CONNECTED: "isConnected";
        static readonly SHIELD_MANAGER_HOST: "shieldManagerHost";
        static readonly SHIELD_MANAGER_USER_NAME: "shieldManagerUserName";
        static readonly UUID: "uuid";
        static readonly VC_PROXY: "vcProxy";
        static readonly VC_VERSION: "vcVersion";
        static readonly USE_VSPHERE_SERVICE: "useVsphereService";
        static readonly VSPHERE_WEB_CLIENT_SERVER_URL: "vsphereWebClientServerUrl";
    }
}
