import { MsgType } from "./MsgType";
export declare abstract class SectionType {
    info?: MsgType;
    required?: boolean;
    otherAttributes?: object;
}
export declare namespace SectionType {
    class Fields {
        static readonly INFO: "info";
        static readonly REQUIRED: "required";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
