import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class MediaInsertOrEjectParamsType extends VCloudExtensibleType {
    media?: ReferenceType;
}
export declare namespace MediaInsertOrEjectParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MEDIA: "media";
    }
}
