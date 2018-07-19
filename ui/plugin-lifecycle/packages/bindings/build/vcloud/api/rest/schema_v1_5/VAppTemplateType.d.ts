import { SectionType } from "./../schema/ovf/SectionType";
import { VAppTemplateChildrenType } from "./VAppTemplateChildrenType";
import { OwnerType } from "./OwnerType";
import { ResourceEntityType } from "./ResourceEntityType";
export declare class VAppTemplateType extends ResourceEntityType {
    owner?: OwnerType;
    children?: VAppTemplateChildrenType;
    section?: SectionType[];
    vAppScopedLocalId?: string;
    defaultStorageProfile?: string;
    dateCreated?: Date;
    goldMaster?: boolean;
    ovfDescriptorUploaded?: boolean;
}
export declare namespace VAppTemplateType {
    class Fields extends ResourceEntityType.Fields {
        static readonly OWNER: "owner";
        static readonly CHILDREN: "children";
        static readonly SECTION: "section";
        static readonly V_APP_SCOPED_LOCAL_ID: "vAppScopedLocalId";
        static readonly DEFAULT_STORAGE_PROFILE: "defaultStorageProfile";
        static readonly DATE_CREATED: "dateCreated";
        static readonly GOLD_MASTER: "goldMaster";
        static readonly OVF_DESCRIPTOR_UPLOADED: "ovfDescriptorUploaded";
    }
}
