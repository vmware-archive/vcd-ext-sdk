import { ResourceType } from "./../ResourceType";
import { VimObjectRefType } from "./VimObjectRefType";
export declare class OrganizationResourcePoolSetType extends ResourceType {
    resourcePoolVimObjectRef?: VimObjectRefType[];
}
export declare namespace OrganizationResourcePoolSetType {
    class Fields extends ResourceType.Fields {
        static readonly RESOURCE_POOL_VIM_OBJECT_REF: "resourcePoolVimObjectRef";
    }
}
