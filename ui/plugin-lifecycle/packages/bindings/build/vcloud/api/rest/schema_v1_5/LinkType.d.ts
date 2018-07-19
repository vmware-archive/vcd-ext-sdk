import { ReferenceType } from "./ReferenceType";
export declare class LinkType extends ReferenceType {
    rel?: string;
}
export declare namespace LinkType {
    class Fields extends ReferenceType.Fields {
        static readonly REL: "rel";
    }
}
