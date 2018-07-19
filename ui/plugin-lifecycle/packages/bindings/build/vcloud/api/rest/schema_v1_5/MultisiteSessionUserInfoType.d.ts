import { IdpGroupsType } from "./IdpGroupsType";
import { IdpRecommendedRolesType } from "./IdpRecommendedRolesType";
export declare class MultisiteSessionUserInfoType {
    username?: string;
    fullName?: string;
    email?: string;
    memberProviderType?: string;
    idpRecommendedRoles?: IdpRecommendedRolesType;
    idpGroups?: IdpGroupsType;
}
export declare namespace MultisiteSessionUserInfoType {
    class Fields {
        static readonly USERNAME: "username";
        static readonly FULL_NAME: "fullName";
        static readonly EMAIL: "email";
        static readonly MEMBER_PROVIDER_TYPE: "memberProviderType";
        static readonly IDP_RECOMMENDED_ROLES: "idpRecommendedRoles";
        static readonly IDP_GROUPS: "idpGroups";
    }
}
