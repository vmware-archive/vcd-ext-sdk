import { ResourceType } from "./../ResourceType";
import { VMWProviderVdcResourcePoolType } from "./VMWProviderVdcResourcePoolType";
export declare class VMWProviderVdcResourcePoolSetType extends ResourceType {
    vmwProviderVdcResourcePool?: VMWProviderVdcResourcePoolType[];
}
export declare namespace VMWProviderVdcResourcePoolSetType {
    class Fields extends ResourceType.Fields {
        static readonly VMW_PROVIDER_VDC_RESOURCE_POOL: "vmwProviderVdcResourcePool";
    }
}
