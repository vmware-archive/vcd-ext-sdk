import { ReferenceType } from "./../ReferenceType";
export declare class VimObjectRefType {
    vimServerRef?: ReferenceType;
    moRef?: string;
    vimObjectType?: string;
}
export declare namespace VimObjectRefType {
    class Fields {
        static readonly VIM_SERVER_REF: "vimServerRef";
        static readonly MO_REF: "moRef";
        static readonly VIM_OBJECT_TYPE: "vimObjectType";
    }
}
