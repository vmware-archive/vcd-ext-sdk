import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { DiskType } from "./DiskType";
import { ReferenceType } from "./ReferenceType";
export declare class DiskCreateParamsType extends VCloudExtensibleType {
    disk?: DiskType;
    locality?: ReferenceType;
}
export declare namespace DiskCreateParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DISK: "disk";
        static readonly LOCALITY: "locality";
    }
}
