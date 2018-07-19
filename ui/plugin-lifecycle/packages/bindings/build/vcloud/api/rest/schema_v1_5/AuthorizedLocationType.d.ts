import { EntityType } from "./EntityType";
export declare class AuthorizedLocationType extends EntityType {
    locationId?: string;
    locationName?: string;
    siteName?: string;
    orgName?: string;
    restApiEndpoint?: string;
    uiEndpoint?: string;
    useMultisiteToken?: boolean;
    authContext?: string;
}
export declare namespace AuthorizedLocationType {
    class Fields extends EntityType.Fields {
        static readonly LOCATION_ID: "locationId";
        static readonly LOCATION_NAME: "locationName";
        static readonly SITE_NAME: "siteName";
        static readonly ORG_NAME: "orgName";
        static readonly REST_API_ENDPOINT: "restApiEndpoint";
        static readonly UI_ENDPOINT: "uiEndpoint";
        static readonly USE_MULTISITE_TOKEN: "useMultisiteToken";
        static readonly AUTH_CONTEXT: "authContext";
    }
}
