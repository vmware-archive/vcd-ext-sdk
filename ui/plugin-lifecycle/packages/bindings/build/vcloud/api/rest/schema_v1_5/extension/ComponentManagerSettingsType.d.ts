import { ResourceType } from "./../ResourceType";
export declare class ComponentManagerSettingsType extends ResourceType {
    cmUrl?: string;
    ssoAdminUsername?: string;
    ssoAdminPassword?: string;
}
export declare namespace ComponentManagerSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly CM_URL: "cmUrl";
        static readonly SSO_ADMIN_USERNAME: "ssoAdminUsername";
        static readonly SSO_ADMIN_PASSWORD: "ssoAdminPassword";
    }
}
