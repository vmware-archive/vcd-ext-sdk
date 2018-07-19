import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class OrgLdapGroupAttributesType extends VCloudExtensibleType {
    objectClass?: string;
    objectIdentifier?: string;
    groupName?: string;
    membership?: string;
    membershipIdentifier?: string;
    backLinkIdentifier?: string;
}
export declare namespace OrgLdapGroupAttributesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly OBJECT_CLASS: "objectClass";
        static readonly OBJECT_IDENTIFIER: "objectIdentifier";
        static readonly GROUP_NAME: "groupName";
        static readonly MEMBERSHIP: "membership";
        static readonly MEMBERSHIP_IDENTIFIER: "membershipIdentifier";
        static readonly BACK_LINK_IDENTIFIER: "backLinkIdentifier";
    }
}
