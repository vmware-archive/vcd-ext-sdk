import { MsgType } from "./MsgType";
import { SectionType } from "./SectionType";
export declare class OperatingSystemSectionType extends SectionType {
    description?: MsgType;
    any?: object[];
    id?: number;
    version?: string;
}
export declare namespace OperatingSystemSectionType {
    class Fields extends SectionType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly ANY: "any";
        static readonly ID: "id";
        static readonly VERSION: "version";
    }
}
