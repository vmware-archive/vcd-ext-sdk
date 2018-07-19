import { OAuthKeyConfigurationType } from "./OAuthKeyConfigurationType";
import { ResourceType } from "./ResourceType";
export declare class OAuthKeyConfigurationsListType extends ResourceType {
    oAuthKeyConfiguration?: OAuthKeyConfigurationType[];
}
export declare namespace OAuthKeyConfigurationsListType {
    class Fields extends ResourceType.Fields {
        static readonly O_AUTH_KEY_CONFIGURATION: "oAuthKeyConfiguration";
    }
}
