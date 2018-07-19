import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { VimObjectRefsType } from "./VimObjectRefsType";
export declare class VMWStorageProfileType extends VCloudExtensibleType {
    moRef?: string;
    vimObjectType?: string;
    freeStorageMb?: number;
    totalStorageMb?: number;
    dataStoreRefs?: VimObjectRefsType;
    name?: string;
}
export declare namespace VMWStorageProfileType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MO_REF: "moRef";
        static readonly VIM_OBJECT_TYPE: "vimObjectType";
        static readonly FREE_STORAGE_MB: "freeStorageMb";
        static readonly TOTAL_STORAGE_MB: "totalStorageMb";
        static readonly DATA_STORE_REFS: "dataStoreRefs";
        static readonly NAME: "name";
    }
}
