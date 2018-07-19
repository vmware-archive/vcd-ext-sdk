import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class RoleReferencesType extends VCloudExtensibleType {
    roleReference?: ReferenceType[];
}
export declare namespace RoleReferencesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ROLE_REFERENCE: "roleReference";
    }
}
