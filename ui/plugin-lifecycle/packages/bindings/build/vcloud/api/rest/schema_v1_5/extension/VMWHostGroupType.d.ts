import { VMWHostReferencesType } from "./VMWHostReferencesType";
import { EntityType } from "./../EntityType";
export declare class VMWHostGroupType extends EntityType {
    hosts?: VMWHostReferencesType;
}
export declare namespace VMWHostGroupType {
    class Fields extends EntityType.Fields {
        static readonly HOSTS: "hosts";
    }
}
