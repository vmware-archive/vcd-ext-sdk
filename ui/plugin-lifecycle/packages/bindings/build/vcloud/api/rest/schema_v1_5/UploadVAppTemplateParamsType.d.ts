import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class UploadVAppTemplateParamsType extends ParamsType {
    vdcStorageProfile?: ReferenceType;
    manifestRequired?: boolean;
    sourceHref?: string;
    transferFormat?: string;
}
export declare namespace UploadVAppTemplateParamsType {
    class Fields extends ParamsType.Fields {
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly MANIFEST_REQUIRED: "manifestRequired";
        static readonly SOURCE_HREF: "sourceHref";
        static readonly TRANSFER_FORMAT: "transferFormat";
    }
}
