import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class RightReferencesType extends VCloudExtensibleType {
    rightReference?: ReferenceType[];
}
export declare namespace RightReferencesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly RIGHT_REFERENCE: "rightReference";
    }
}
