import { ReferenceType } from "./ReferenceType";
export declare class ResourceReferenceType extends ReferenceType {
    status?: number;
}
export declare namespace ResourceReferenceType {
    class Fields extends ReferenceType.Fields {
        static readonly STATUS: "status";
    }
}
