import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class VdcReferencesType extends ResourceType {
    vdcReference?: ReferenceType[];
}
export declare namespace VdcReferencesType {
    class Fields extends ResourceType.Fields {
        static readonly VDC_REFERENCE: "vdcReference";
    }
}
