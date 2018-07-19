import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class DiskAttachOrDetachParamsType extends VCloudExtensibleType {
    disk?: ReferenceType;
    busNumber?: number;
    unitNumber?: number;
}
export declare namespace DiskAttachOrDetachParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DISK: "disk";
        static readonly BUS_NUMBER: "busNumber";
        static readonly UNIT_NUMBER: "unitNumber";
    }
}
