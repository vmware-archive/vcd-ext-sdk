import { ResourceType } from "./ResourceType";
import { OperatingSystemFamilyInfoType } from "./OperatingSystemFamilyInfoType";
export declare class SupportedOperatingSystemsInfoType extends ResourceType {
    operatingSystemFamilyInfo?: OperatingSystemFamilyInfoType[];
}
export declare namespace SupportedOperatingSystemsInfoType {
    class Fields extends ResourceType.Fields {
        static readonly OPERATING_SYSTEM_FAMILY_INFO: "operatingSystemFamilyInfo";
    }
}
