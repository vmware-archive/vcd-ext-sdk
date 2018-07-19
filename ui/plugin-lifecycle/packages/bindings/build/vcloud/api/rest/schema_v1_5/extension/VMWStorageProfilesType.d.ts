import { ResourceType } from "./../ResourceType";
import { VMWStorageProfileType } from "./VMWStorageProfileType";
export declare class VMWStorageProfilesType extends ResourceType {
    vmwStorageProfile?: VMWStorageProfileType[];
}
export declare namespace VMWStorageProfilesType {
    class Fields extends ResourceType.Fields {
        static readonly VMW_STORAGE_PROFILE: "vmwStorageProfile";
    }
}
