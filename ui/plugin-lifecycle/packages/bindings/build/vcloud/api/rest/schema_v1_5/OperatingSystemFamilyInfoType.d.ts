import { OperatingSystemInfoType } from "./OperatingSystemInfoType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class OperatingSystemFamilyInfoType extends VCloudExtensibleType {
    name?: string;
    operatingSystemFamilyId?: number;
    operatingSystem?: OperatingSystemInfoType[];
}
export declare namespace OperatingSystemFamilyInfoType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly OPERATING_SYSTEM_FAMILY_ID: "operatingSystemFamilyId";
        static readonly OPERATING_SYSTEM: "operatingSystem";
    }
}
