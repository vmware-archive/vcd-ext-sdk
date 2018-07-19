import { ResourceType } from "./../ResourceType";
export declare class LdapGroupAttributesType extends ResourceType {
    objectClass?: string;
    objectIdentifier?: string;
    groupName?: string;
    membership?: string;
    membershipIdentifier?: string;
    backLinkIdentifier?: string;
}
export declare namespace LdapGroupAttributesType {
    class Fields extends ResourceType.Fields {
        static readonly OBJECT_CLASS: "objectClass";
        static readonly OBJECT_IDENTIFIER: "objectIdentifier";
        static readonly GROUP_NAME: "groupName";
        static readonly MEMBERSHIP: "membership";
        static readonly MEMBERSHIP_IDENTIFIER: "membershipIdentifier";
        static readonly BACK_LINK_IDENTIFIER: "backLinkIdentifier";
    }
}
