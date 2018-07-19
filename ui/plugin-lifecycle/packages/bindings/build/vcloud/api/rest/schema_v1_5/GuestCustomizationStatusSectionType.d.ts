import { SectionType } from "./../schema/ovf/SectionType";
export declare class GuestCustomizationStatusSectionType extends SectionType {
    guestCustStatus?: string;
    any?: object[];
    href?: string;
    type?: string;
}
export declare namespace GuestCustomizationStatusSectionType {
    class Fields extends SectionType.Fields {
        static readonly GUEST_CUST_STATUS: "guestCustStatus";
        static readonly ANY: "any";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
