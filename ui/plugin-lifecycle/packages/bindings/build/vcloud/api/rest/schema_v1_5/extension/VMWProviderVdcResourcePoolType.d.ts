import { ResourceType } from "./../ResourceType";
import { VimObjectRefType } from "./VimObjectRefType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWProviderVdcResourcePoolType extends ResourceType {
    resourcePoolVimObjectRef?: VimObjectRefType;
    resourcePoolRef?: ReferenceType;
    enabled?: boolean;
    primary?: boolean;
}
export declare namespace VMWProviderVdcResourcePoolType {
    class Fields extends ResourceType.Fields {
        static readonly RESOURCE_POOL_VIM_OBJECT_REF: "resourcePoolVimObjectRef";
        static readonly RESOURCE_POOL_REF: "resourcePoolRef";
        static readonly ENABLED: "enabled";
        static readonly PRIMARY: "primary";
    }
}
