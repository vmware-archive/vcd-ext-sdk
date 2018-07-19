import { MsgType } from "./MsgType";
import { SectionType } from "./SectionType";
export declare class AnnotationSectionType extends SectionType {
    annotation?: MsgType;
    any?: object[];
}
export declare namespace AnnotationSectionType {
    class Fields extends SectionType.Fields {
        static readonly ANNOTATION: "annotation";
        static readonly ANY: "any";
    }
}
