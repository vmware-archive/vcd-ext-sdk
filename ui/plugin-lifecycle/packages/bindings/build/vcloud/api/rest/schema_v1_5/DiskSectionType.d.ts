import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { DiskSettingsType } from "./DiskSettingsType";
export declare class DiskSectionType extends VCloudExtensibleType {
    diskSettings?: DiskSettingsType[];
}
export declare namespace DiskSectionType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DISK_SETTINGS: "diskSettings";
    }
}
