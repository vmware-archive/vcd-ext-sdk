import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { VendorTemplateType } from "./VendorTemplateType";
import { LBVirtualServerServiceProfileType } from "./LBVirtualServerServiceProfileType";
import { ReferenceType } from "./ReferenceType";
export declare class LoadBalancerVirtualServerType extends VCloudExtensibleType {
    isEnabled?: boolean;
    name?: string;
    description?: string;
    _interface?: ReferenceType;
    ipAddress?: string;
    serviceProfile?: LBVirtualServerServiceProfileType[];
    logging?: boolean;
    pool?: string;
    loadBalancerTemplates?: VendorTemplateType[];
}
export declare namespace LoadBalancerVirtualServerType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_ENABLED: "isEnabled";
        static readonly NAME: "name";
        static readonly DESCRIPTION: "description";
        static readonly _INTERFACE: "_interface";
        static readonly IP_ADDRESS: "ipAddress";
        static readonly SERVICE_PROFILE: "serviceProfile";
        static readonly LOGGING: "logging";
        static readonly POOL: "pool";
        static readonly LOAD_BALANCER_TEMPLATES: "loadBalancerTemplates";
    }
}
