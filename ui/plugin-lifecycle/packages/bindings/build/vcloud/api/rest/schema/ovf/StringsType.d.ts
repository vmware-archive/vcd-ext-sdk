import { StringsMsg } from "./StringsMsg";
export declare class StringsType {
    msg?: StringsMsg[];
    fileRef?: string;
    lang?: string;
    otherAttributes?: object;
}
export declare namespace StringsType {
    class Fields {
        static readonly MSG: "msg";
        static readonly FILE_REF: "fileRef";
        static readonly LANG: "lang";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
