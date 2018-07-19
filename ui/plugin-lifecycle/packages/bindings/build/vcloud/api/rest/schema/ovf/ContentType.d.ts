import { MsgType } from "./MsgType";
import { SectionType } from "./SectionType";
export declare abstract class ContentType {
    info?: MsgType;
    name?: MsgType;
    section?: SectionType[];
    id?: string;
    otherAttributes?: object;
}
export declare namespace ContentType {
    class Fields {
        static readonly INFO: "info";
        static readonly NAME: "name";
        static readonly SECTION: "section";
        static readonly ID: "id";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
