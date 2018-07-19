import { ResourceType } from "./../ResourceType";
import { LdapUserAttributesType } from "./LdapUserAttributesType";
import { LdapGroupAttributesType } from "./LdapGroupAttributesType";
export declare class LdapSettingsType extends ResourceType {
    hostName?: string;
    port?: number;
    isSsl?: boolean;
    isSslAcceptAll?: boolean;
    realm?: string;
    pagedSearchDisabled?: boolean;
    pageSize?: number;
    maxResults?: number;
    maxUserGroups?: number;
    searchBase?: string;
    userName?: string;
    password?: string;
    authenticationMechanism?: string;
    groupSearchBase?: string;
    isGroupSearchBaseEnabled?: boolean;
    connectorType?: string;
    userAttributes?: LdapUserAttributesType;
    groupAttributes?: LdapGroupAttributesType;
    useExternalKerberos?: boolean;
}
export declare namespace LdapSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly HOST_NAME: "hostName";
        static readonly PORT: "port";
        static readonly IS_SSL: "isSsl";
        static readonly IS_SSL_ACCEPT_ALL: "isSslAcceptAll";
        static readonly REALM: "realm";
        static readonly PAGED_SEARCH_DISABLED: "pagedSearchDisabled";
        static readonly PAGE_SIZE: "pageSize";
        static readonly MAX_RESULTS: "maxResults";
        static readonly MAX_USER_GROUPS: "maxUserGroups";
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
