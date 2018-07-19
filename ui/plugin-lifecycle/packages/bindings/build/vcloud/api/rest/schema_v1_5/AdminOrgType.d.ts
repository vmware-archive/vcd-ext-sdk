import { GroupsListType } from "./GroupsListType";
import { CatalogsListType } from "./CatalogsListType";
import { RoleReferencesType } from "./RoleReferencesType";
import { VdcsType } from "./VdcsType";
import { OrganizationRightsType } from "./OrganizationRightsType";
import { OrganizationRolesType } from "./OrganizationRolesType";
import { OrgType } from "./OrgType";
import { OrgAssociationsType } from "./OrgAssociationsType";
import { OrgSettingsType } from "./OrgSettingsType";
import { NetworksType } from "./NetworksType";
import { UsersListType } from "./UsersListType";
import { VdcTemplatesType } from "./VdcTemplatesType";
export declare class AdminOrgType extends OrgType {
    settings?: OrgSettingsType;
    users?: UsersListType;
    groups?: GroupsListType;
    catalogs?: CatalogsListType;
    vdcs?: VdcsType;
    vdcTemplates?: VdcTemplatesType;
    networks?: NetworksType;
    orgAssociations?: OrgAssociationsType;
    rightReferences?: OrganizationRightsType;
    roleReferences?: OrganizationRolesType;
    roleTemplateReferences?: RoleReferencesType;
}
export declare namespace AdminOrgType {
    class Fields extends OrgType.Fields {
        static readonly SETTINGS: "settings";
        static readonly USERS: "users";
        static readonly GROUPS: "groups";
        static readonly CATALOGS: "catalogs";
        static readonly VDCS: "vdcs";
        static readonly VDC_TEMPLATES: "vdcTemplates";
        static readonly NETWORKS: "networks";
        static readonly ORG_ASSOCIATIONS: "orgAssociations";
        static readonly RIGHT_REFERENCES: "rightReferences";
        static readonly ROLE_REFERENCES: "roleReferences";
        static readonly ROLE_TEMPLATE_REFERENCES: "roleTemplateReferences";
    }
}
