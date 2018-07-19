import { ResourceType } from "./ResourceType";
export declare class IdpRecommendedRolesType extends ResourceType {
    idpRecommendedRoles?: string[];
}
export declare namespace IdpRecommendedRolesType {
    class Fields extends ResourceType.Fields {
        static readonly IDP_RECOMMENDED_ROLES: "idpRecommendedRoles";
    }
}
