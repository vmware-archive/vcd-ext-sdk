import { StringsType } from "./StringsType";
import { ContentType } from "./ContentType";
import { SectionType } from "./SectionType";
import { ReferencesType } from "./ReferencesType";
export declare class EnvelopeType {
    references?: ReferencesType;
    section?: SectionType[];
    content?: ContentType;
    strings?: StringsType[];
    lang?: string;
    otherAttributes?: object;
}
export declare namespace EnvelopeType {
    class Fields {
        static readonly REFERENCES: "references";
        static readonly SECTION: "section";
        static readonly CONTENT: "content";
        static readonly STRINGS: "strings";
        static readonly LANG: "lang";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
