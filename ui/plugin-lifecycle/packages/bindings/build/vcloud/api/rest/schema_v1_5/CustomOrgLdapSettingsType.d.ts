import { OrgLdapGroupAttributesType } from "./OrgLdapGroupAttributesType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { OrgLdapUserAttributesType } from "./OrgLdapUserAttributesType";
export declare class CustomOrgLdapSettingsType extends VCloudExtensibleType {
    hostName?: string;
    port?: number;
    isSsl?: boolean;
    isSslAcceptAll?: boolean;
    realm?: string;
    searchBase?: string;
    userName?: string;
    password?: string;
    authenticationMechanism?: string;
    groupSearchBase?: string;
    isGroupSearchBaseEnabled?: boolean;
    connectorType?: string;
    userAttributes?: OrgLdapUserAttributesType;
    groupAttributes?: OrgLdapGroupAttributesType;
    useExternalKerberos?: boolean;
}
export declare namespace CustomOrgLdapSettingsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly HOST_NAME: "hostName";
        static readonly PORT: "port";
        static readonly IS_SSL: "isSsl";
        static readonly IS_SSL_ACCEPT_ALL: "isSslAcceptAll";
        static readonly REALM: "realm";
        static readonly SEARCH_BASE: "searchBase";
        static readonly USER_NAME: "userName";
        static readonly PASSWORD: "password";
        static readonly AUTHENTICATION_MECHANISM: "authenticationMechanism";
        static readonly GROUP_SEARCH_BASE: "groupSearchBase";
        static readonly IS_GROUP_SEARCH_BASE_ENABLED: "isGroupSearchBaseEnabled";
        static readonly CONNECTOR_TYPE: "connectorType";
        static readonly USER_ATTRIBUTES: "userAttributes";
        static readonly GROUP_ATTRIBUTES: "groupAttributes";
        static readonly USE_EXTERNAL_KERBEROS: "useExternalKerberos";
    }
}
