import { EntityType } from "./../EntityType";
import { VimObjectRefsType } from "./VimObjectRefsType";
export declare class ResourcePoolType extends EntityType {
    moRef?: string;
    vimObjectType?: string;
    dataStoreRefs?: VimObjectRefsType;
}
export declare namespace ResourcePoolType {
    class Fields extends EntityType.Fields {
        static readonly MO_REF: "moRef";
        static readonly VIM_OBJECT_TYPE: "vimObjectType";
        static readonly DATA_STORE_REFS: "dataStoreRefs";
    }
}
