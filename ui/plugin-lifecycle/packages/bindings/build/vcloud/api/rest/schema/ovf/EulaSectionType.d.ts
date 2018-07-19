import { MsgType } from "./MsgType";
import { SectionType } from "./SectionType";
export declare class EulaSectionType extends SectionType {
    license?: MsgType;
    any?: object[];
}
export declare namespace EulaSectionType {
    class Fields extends SectionType.Fields {
        static readonly LICENSE: "license";
        static readonly ANY: "any";
    }
}
