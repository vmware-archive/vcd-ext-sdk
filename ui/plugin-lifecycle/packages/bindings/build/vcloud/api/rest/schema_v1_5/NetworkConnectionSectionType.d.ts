import { SectionType } from "./../schema/ovf/SectionType";
import { NetworkConnectionType } from "./NetworkConnectionType";
import { LinkType } from "./LinkType";
export declare class NetworkConnectionSectionType extends SectionType {
    primaryNetworkConnectionIndex?: number;
    networkConnection?: NetworkConnectionType[];
    link?: LinkType[];
    any?: object[];
    href?: string;
    type?: string;
}
export declare namespace NetworkConnectionSectionType {
    class Fields extends SectionType.Fields {
        static readonly PRIMARY_NETWORK_CONNECTION_INDEX: "primaryNetworkConnectionIndex";
        static readonly NETWORK_CONNECTION: "networkConnection";
        static readonly LINK: "link";
        static readonly ANY: "any";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
