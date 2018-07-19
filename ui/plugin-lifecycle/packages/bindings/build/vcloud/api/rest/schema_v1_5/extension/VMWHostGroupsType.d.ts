import { ResourceType } from "./../ResourceType";
import { VMWHostGroupType } from "./VMWHostGroupType";
export declare class VMWHostGroupsType extends ResourceType {
    hostGroup?: VMWHostGroupType[];
}
export declare namespace VMWHostGroupsType {
    class Fields extends ResourceType.Fields {
        static readonly HOST_GROUP: "hostGroup";
    }
}
