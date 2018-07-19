import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWHostReferencesType extends ResourceType {
    hostReference?: ReferenceType[];
}
export declare namespace VMWHostReferencesType {
    class Fields extends ResourceType.Fields {
        static readonly HOST_REFERENCE: "hostReference";
    }
}
