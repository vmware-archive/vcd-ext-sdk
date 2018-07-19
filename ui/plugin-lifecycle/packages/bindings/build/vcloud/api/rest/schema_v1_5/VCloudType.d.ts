import { RoleReferencesType } from "./RoleReferencesType";
import { RightReferencesType } from "./RightReferencesType";
import { EntityType } from "./EntityType";
import { OrganizationReferencesType } from "./OrganizationReferencesType";
import { ProviderVdcReferencesType } from "./ProviderVdcReferencesType";
import { NetworksType } from "./NetworksType";
export declare class VCloudType extends EntityType {
    organizationReferences?: OrganizationReferencesType;
    providerVdcReferences?: ProviderVdcReferencesType;
    rightReferences?: RightReferencesType;
    roleReferences?: RoleReferencesType;
    networks?: NetworksType;
}
export declare namespace VCloudType {
    class Fields extends EntityType.Fields {
        static readonly ORGANIZATION_REFERENCES: "organizationReferences";
        static readonly PROVIDER_VDC_REFERENCES: "providerVdcReferences";
        static readonly RIGHT_REFERENCES: "rightReferences";
        static readonly ROLE_REFERENCES: "roleReferences";
        static readonly NETWORKS: "networks";
    }
}
