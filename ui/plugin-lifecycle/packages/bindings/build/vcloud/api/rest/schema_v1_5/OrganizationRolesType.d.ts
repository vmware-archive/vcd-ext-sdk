import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class OrganizationRolesType extends ResourceType {
    roleReference?: ReferenceType[];
}
export declare namespace OrganizationRolesType {
    class Fields extends ResourceType.Fields {
        static readonly ROLE_REFERENCE: "roleReference";
    }
}
