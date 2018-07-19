import { FileType } from "./FileType";
export declare class ReferencesType {
    file?: FileType[];
    any?: object[];
    otherAttributes?: object;
}
export declare namespace ReferencesType {
    class Fields {
        static readonly FILE: "file";
        static readonly ANY: "any";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
