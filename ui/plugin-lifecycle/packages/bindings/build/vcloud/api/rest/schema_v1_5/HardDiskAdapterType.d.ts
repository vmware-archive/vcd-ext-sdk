import { RangesType } from "./RangesType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class HardDiskAdapterType extends VCloudExtensibleType {
    busNumberRanges?: RangesType;
    unitNumberRanges?: RangesType;
    id?: string;
    legacyId?: number;
    maximumDiskSizeGb?: number;
    name?: string;
}
export declare namespace HardDiskAdapterType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly BUS_NUMBER_RANGES: "busNumberRanges";
        static readonly UNIT_NUMBER_RANGES: "unitNumberRanges";
        static readonly ID: "id";
        static readonly LEGACY_ID: "legacyId";
        static readonly MAXIMUM_DISK_SIZE_GB: "maximumDiskSizeGb";
        static readonly NAME: "name";
    }
}
