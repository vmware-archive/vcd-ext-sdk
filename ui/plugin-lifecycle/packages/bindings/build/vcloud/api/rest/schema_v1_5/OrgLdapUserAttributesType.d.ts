import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class OrgLdapUserAttributesType extends VCloudExtensibleType {
    objectClass?: string;
    objectIdentifier?: string;
    userName?: string;
    email?: string;
    fullName?: string;
    givenName?: string;
    surname?: string;
    telephone?: string;
    groupMembershipIdentifier?: string;
    groupBackLinkIdentifier?: string;
}
export declare namespace OrgLdapUserAttributesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly OBJECT_CLASS: "objectClass";
        static readonly OBJECT_IDENTIFIER: "objectIdentifier";
        static readonly USER_NAME: "userName";
        static readonly EMAIL: "email";
        static readonly FULL_NAME: "fullName";
        static readonly GIVEN_NAME: "givenName";
        static readonly SURNAME: "surname";
        static readonly TELEPHONE: "telephone";
        static readonly GROUP_MEMBERSHIP_IDENTIFIER: "groupMembershipIdentifier";
        static readonly GROUP_BACK_LINK_IDENTIFIER: "groupBackLinkIdentifier";
    }
}
