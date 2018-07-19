import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LinkType } from "./LinkType";
export declare class ResourceType extends VCloudExtensibleType {
    link?: LinkType[];
    href?: string;
    type?: string;
}
export declare namespace ResourceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly LINK: "link";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
