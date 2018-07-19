import { ResourceType } from "./../ResourceType";
import { VMWVmGroupReferencesType } from "./VMWVmGroupReferencesType";
export declare class VMWNamedVmGroupType extends ResourceType {
    vmwVmGroupReferences?: VMWVmGroupReferencesType;
}
export declare namespace VMWNamedVmGroupType {
    class Fields extends ResourceType.Fields {
        static readonly VMW_VM_GROUP_REFERENCES: "vmwVmGroupReferences";
    }
}
