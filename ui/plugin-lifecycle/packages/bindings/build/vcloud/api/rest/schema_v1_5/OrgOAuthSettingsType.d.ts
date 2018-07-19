import { OAuthKeyConfigurationsListType } from "./OAuthKeyConfigurationsListType";
import { ResourceType } from "./ResourceType";
export declare class OrgOAuthSettingsType extends ResourceType {
    issuerId?: string;
    oAuthKeyConfigurations?: OAuthKeyConfigurationsListType;
    enabled?: boolean;
}
export declare namespace OrgOAuthSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly ISSUER_ID: "issuerId";
        static readonly O_AUTH_KEY_CONFIGURATIONS: "oAuthKeyConfigurations";
        static readonly ENABLED: "enabled";
    }
}
