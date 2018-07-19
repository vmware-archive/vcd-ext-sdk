import { SectionType } from "./../schema/ovf/SectionType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class InstantiationParamsType extends VCloudExtensibleType {
    section?: SectionType[];
}
export declare namespace InstantiationParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SECTION: "section";
    }
}
