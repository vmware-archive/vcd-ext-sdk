import { SectionType } from "./../schema/ovf/SectionType";
import { LinkType } from "./LinkType";
export declare class CustomizationSectionType extends SectionType {
    customizeOnInstantiate?: boolean;
    link?: LinkType[];
    any?: object[];
    goldMaster?: boolean;
    href?: string;
    type?: string;
}
export declare namespace CustomizationSectionType {
    class Fields extends SectionType.Fields {
        static readonly CUSTOMIZE_ON_INSTANTIATE: "customizeOnInstantiate";
        static readonly LINK: "link";
        static readonly ANY: "any";
        static readonly GOLD_MASTER: "goldMaster";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
