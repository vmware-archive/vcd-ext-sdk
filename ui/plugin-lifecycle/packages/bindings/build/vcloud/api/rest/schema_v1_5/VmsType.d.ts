import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class VmsType extends ResourceType {
    vmReference?: ReferenceType[];
}
export declare namespace VmsType {
    class Fields extends ResourceType.Fields {
        static readonly VM_REFERENCE: "vmReference";
    }
}
