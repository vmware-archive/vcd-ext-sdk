import { ResourceType } from "./ResourceType";
export declare class IdpGroupsType extends ResourceType {
    idpGroups?: string[];
}
export declare namespace IdpGroupsType {
    class Fields extends ResourceType.Fields {
        static readonly IDP_GROUPS: "idpGroups";
    }
}
