import { OwnerType } from "./OwnerType";
import { ResourceEntityType } from "./ResourceEntityType";
import { ReferenceType } from "./ReferenceType";
export declare class MediaType extends ResourceEntityType {
    owner?: OwnerType;
    vdcStorageProfile?: ReferenceType;
    imageType?: string;
    size?: number;
}
export declare namespace MediaType {
    class Fields extends ResourceEntityType.Fields {
        static readonly OWNER: "owner";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly IMAGE_TYPE: "imageType";
        static readonly SIZE: "size";
    }
}
