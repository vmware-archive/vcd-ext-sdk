import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { OrganizationReferenceType } from "./OrganizationReferenceType";
export declare class OrganizationReferencesType extends VCloudExtensibleType {
    organizationReference?: OrganizationReferenceType[];
}
export declare namespace OrganizationReferencesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ORGANIZATION_REFERENCE: "organizationReference";
    }
}
