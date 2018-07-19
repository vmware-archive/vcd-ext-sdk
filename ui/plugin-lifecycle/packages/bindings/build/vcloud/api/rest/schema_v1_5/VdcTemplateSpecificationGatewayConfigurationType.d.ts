import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { OrgVdcNetworkType } from "./OrgVdcNetworkType";
import { GatewayType } from "./GatewayType";
export declare class VdcTemplateSpecificationGatewayConfigurationType extends VCloudExtensibleType {
    gateway?: GatewayType;
    network?: OrgVdcNetworkType;
}
export declare namespace VdcTemplateSpecificationGatewayConfigurationType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly GATEWAY: "gateway";
        static readonly NETWORK: "network";
    }
}
