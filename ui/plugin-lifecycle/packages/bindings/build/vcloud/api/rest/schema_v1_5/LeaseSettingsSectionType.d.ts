import { SectionType } from "./../schema/ovf/SectionType";
import { LinkType } from "./LinkType";
export declare class LeaseSettingsSectionType extends SectionType {
    link?: LinkType[];
    deploymentLeaseInSeconds?: number;
    storageLeaseInSeconds?: number;
    deploymentLeaseExpiration?: Date;
    storageLeaseExpiration?: Date;
    any?: object[];
    href?: string;
    type?: string;
}
export declare namespace LeaseSettingsSectionType {
    class Fields extends SectionType.Fields {
        static readonly LINK: "link";
        static readonly DEPLOYMENT_LEASE_IN_SECONDS: "deploymentLeaseInSeconds";
        static readonly STORAGE_LEASE_IN_SECONDS: "storageLeaseInSeconds";
        static readonly DEPLOYMENT_LEASE_EXPIRATION: "deploymentLeaseExpiration";
        static readonly STORAGE_LEASE_EXPIRATION: "storageLeaseExpiration";
        static readonly ANY: "any";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
