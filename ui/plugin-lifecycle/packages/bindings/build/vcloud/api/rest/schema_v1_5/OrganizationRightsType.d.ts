import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class OrganizationRightsType extends ResourceType {
    rightReference?: ReferenceType[];
}
export declare namespace OrganizationRightsType {
    class Fields extends ResourceType.Fields {
        static readonly RIGHT_REFERENCE: "rightReference";
    }
}
