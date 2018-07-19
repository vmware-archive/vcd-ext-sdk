import { SectionType } from "./../schema/ovf/SectionType";
import { LinkType } from "./LinkType";
import { SnapshotType } from "./SnapshotType";
export declare class SnapshotSectionType extends SectionType {
    link?: LinkType[];
    snapshot?: SnapshotType;
    any?: object[];
    href?: string;
    type?: string;
}
export declare namespace SnapshotSectionType {
    class Fields extends SectionType.Fields {
        static readonly LINK: "link";
        static readonly SNAPSHOT: "snapshot";
        static readonly ANY: "any";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
