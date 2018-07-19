import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class VdcsType extends VCloudExtensibleType {
    vdc?: ReferenceType[];
}
export declare namespace VdcsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VDC: "vdc";
    }
}
