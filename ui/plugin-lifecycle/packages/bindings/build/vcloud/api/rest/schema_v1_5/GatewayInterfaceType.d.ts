import { SubnetParticipationType } from "./SubnetParticipationType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class GatewayInterfaceType extends VCloudExtensibleType {
    name?: string;
    displayName?: string;
    network?: ReferenceType;
    interfaceType?: string;
    subnetParticipation?: SubnetParticipationType[];
    applyRateLimit?: boolean;
    inRateLimit?: number;
    outRateLimit?: number;
    useForDefaultRoute?: boolean;
}
export declare namespace GatewayInterfaceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly DISPLAY_NAME: "displayName";
        static readonly NETWORK: "network";
        static readonly INTERFACE_TYPE: "interfaceType";
        static readonly SUBNET_PARTICIPATION: "subnetParticipation";
        static readonly APPLY_RATE_LIMIT: "applyRateLimit";
        static readonly IN_RATE_LIMIT: "inRateLimit";
        static readonly OUT_RATE_LIMIT: "outRateLimit";
        static readonly USE_FOR_DEFAULT_ROUTE: "useForDefaultRoute";
    }
}
