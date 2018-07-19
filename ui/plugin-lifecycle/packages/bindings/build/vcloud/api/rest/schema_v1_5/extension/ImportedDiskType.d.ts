import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { ReferenceType } from "./../ReferenceType";
export declare class ImportedDiskType extends VCloudExtensibleType {
    vdcStorageProfile?: ReferenceType;
    instanceId?: string;
    iops?: number;
}
export declare namespace ImportedDiskType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly INSTANCE_ID: "instanceId";
        static readonly IOPS: "iops";
    }
}
