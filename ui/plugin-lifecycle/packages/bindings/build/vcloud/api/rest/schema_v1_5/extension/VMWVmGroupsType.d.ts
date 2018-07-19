import { ResourceType } from "./../ResourceType";
import { VMWVmGroupType } from "./VMWVmGroupType";
export declare class VMWVmGroupsType extends ResourceType {
    vmGroup?: VMWVmGroupType[];
}
export declare namespace VMWVmGroupsType {
    class Fields extends ResourceType.Fields {
        static readonly VM_GROUP: "vmGroup";
    }
}
