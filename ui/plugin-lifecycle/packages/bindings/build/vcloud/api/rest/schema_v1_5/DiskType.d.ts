import { OwnerType } from "./OwnerType";
import { ResourceEntityType } from "./ResourceEntityType";
import { ReferenceType } from "./ReferenceType";
export declare class DiskType extends ResourceEntityType {
    storageProfile?: ReferenceType;
    owner?: OwnerType;
    busSubType?: string;
    busType?: string;
    iops?: number;
    size?: number;
}
export declare namespace DiskType {
    class Fields extends ResourceEntityType.Fields {
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly OWNER: "owner";
        static readonly BUS_SUB_TYPE: "busSubType";
        static readonly BUS_TYPE: "busType";
        static readonly IOPS: "iops";
        static readonly SIZE: "size";
    }
}
