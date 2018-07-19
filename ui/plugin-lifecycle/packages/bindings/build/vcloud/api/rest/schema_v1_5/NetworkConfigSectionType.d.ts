import { SectionType } from "./../schema/ovf/SectionType";
import { LinkType } from "./LinkType";
import { VAppNetworkConfigurationType } from "./VAppNetworkConfigurationType";
export declare class NetworkConfigSectionType extends SectionType {
    link?: LinkType[];
    networkConfig?: VAppNetworkConfigurationType[];
    any?: object[];
    href?: string;
    type?: string;
}
export declare namespace NetworkConfigSectionType {
    class Fields extends SectionType.Fields {
        static readonly LINK: "link";
        static readonly NETWORK_CONFIG: "networkConfig";
        static readonly ANY: "any";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
