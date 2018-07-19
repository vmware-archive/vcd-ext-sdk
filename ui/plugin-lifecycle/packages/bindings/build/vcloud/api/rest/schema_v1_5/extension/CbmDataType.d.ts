import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { ReferenceType } from "./../ReferenceType";
export declare class CbmDataType extends VCloudExtensibleType {
    vimServer?: ReferenceType;
    backingRef?: string;
    backingRefType?: string;
}
export declare namespace CbmDataType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VIM_SERVER: "vimServer";
        static readonly BACKING_REF: "backingRef";
        static readonly BACKING_REF_TYPE: "backingRefType";
    }
}
