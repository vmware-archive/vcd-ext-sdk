import { NetworkType } from "./NetworkType";
import { VimObjectRefType } from "./VimObjectRefType";
import { GatewayFeaturesType } from "./GatewayFeaturesType";
import { ReferenceType } from "./ReferenceType";
export declare class OrgVdcNetworkType extends NetworkType {
    providerInfo?: string;
    edgeGateway?: ReferenceType;
    serviceConfig?: GatewayFeaturesType;
    isShared?: boolean;
    vimPortGroupRef?: VimObjectRefType;
    status?: number;
}
export declare namespace OrgVdcNetworkType {
    class Fields extends NetworkType.Fields {
        static readonly PROVIDER_INFO: "providerInfo";
        static readonly EDGE_GATEWAY: "edgeGateway";
        static readonly SERVICE_CONFIG: "serviceConfig";
        static readonly IS_SHARED: "isShared";
        static readonly VIM_PORT_GROUP_REF: "vimPortGroupRef";
        static readonly STATUS: "status";
    }
}
