import { VimObjectRefType } from "./VimObjectRefType";
export declare class StrandedItemVimObjectType {
    errorMessage?: string;
    vimObjectRef?: VimObjectRefType;
    name?: string;
}
export declare namespace StrandedItemVimObjectType {
    class Fields {
        static readonly ERROR_MESSAGE: "errorMessage";
        static readonly VIM_OBJECT_REF: "vimObjectRef";
        static readonly NAME: "name";
    }
}
