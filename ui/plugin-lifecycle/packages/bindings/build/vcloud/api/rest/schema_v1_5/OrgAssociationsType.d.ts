import { OrgAssociationType } from "./OrgAssociationType";
import { ResourceType } from "./ResourceType";
export declare class OrgAssociationsType extends ResourceType {
    orgAssociationMember?: OrgAssociationType[];
}
export declare namespace OrgAssociationsType {
    class Fields extends ResourceType.Fields {
        static readonly ORG_ASSOCIATION_MEMBER: "orgAssociationMember";
    }
}
