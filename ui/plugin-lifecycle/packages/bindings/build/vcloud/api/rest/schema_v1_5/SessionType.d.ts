import { ResourceType } from "./ResourceType";
import { AuthorizedLocationsType } from "./AuthorizedLocationsType";
export declare class SessionType extends ResourceType {
    authorizedLocations?: AuthorizedLocationsType;
    locationId?: string;
    org?: string;
    roles?: string;
    user?: string;
    userId?: string;
}
export declare namespace SessionType {
    class Fields extends ResourceType.Fields {
        static readonly AUTHORIZED_LOCATIONS: "authorizedLocations";
        static readonly LOCATION_ID: "locationId";
        static readonly ORG: "org";
        static readonly ROLES: "roles";
        static readonly USER: "user";
        static readonly USER_ID: "userId";
    }
}
