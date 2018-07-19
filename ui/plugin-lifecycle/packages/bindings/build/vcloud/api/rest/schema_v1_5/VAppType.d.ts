import { OwnerType } from "./OwnerType";
import { AbstractVAppType } from "./AbstractVAppType";
import { VAppChildrenType } from "./VAppChildrenType";
export declare class VAppType extends AbstractVAppType {
    owner?: OwnerType;
    autoNature?: boolean;
    inMaintenanceMode?: boolean;
    children?: VAppChildrenType;
    ovfDescriptorUploaded?: boolean;
}
export declare namespace VAppType {
    class Fields extends AbstractVAppType.Fields {
        static readonly OWNER: "owner";
        static readonly AUTO_NATURE: "autoNature";
        static readonly IN_MAINTENANCE_MODE: "inMaintenanceMode";
        static readonly CHILDREN: "children";
        static readonly OVF_DESCRIPTOR_UPLOADED: "ovfDescriptorUploaded";
    }
}
