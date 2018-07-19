import { SectionType } from "./../schema/ovf/SectionType";
import { LinkType } from "./LinkType";
export declare class GuestCustomizationSectionType extends SectionType {
    enabled?: boolean;
    changeSid?: boolean;
    virtualMachineId?: string;
    joinDomainEnabled?: boolean;
    useOrgSettings?: boolean;
    domainName?: string;
    domainUserName?: string;
    domainUserPassword?: string;
    machineObjectOU?: string;
    adminPasswordEnabled?: boolean;
    adminPasswordAuto?: boolean;
    adminPassword?: string;
    adminAutoLogonEnabled?: boolean;
    adminAutoLogonCount?: number;
    resetPasswordRequired?: boolean;
    customizationScript?: string;
    computerName?: string;
    link?: LinkType[];
    any?: object[];
    href?: string;
    type?: string;
}
export declare namespace GuestCustomizationSectionType {
    class Fields extends SectionType.Fields {
        static readonly ENABLED: "enabled";
        static readonly CHANGE_SID: "changeSid";
        static readonly VIRTUAL_MACHINE_ID: "virtualMachineId";
        static readonly JOIN_DOMAIN_ENABLED: "joinDomainEnabled";
        static readonly USE_ORG_SETTINGS: "useOrgSettings";
        static readonly DOMAIN_NAME: "domainName";
        static readonly DOMAIN_USER_NAME: "domainUserName";
        static readonly DOMAIN_USER_PASSWORD: "domainUserPassword";
        static readonly MACHINE_OBJECT_OU: "machineObjectOU";
        static readonly ADMIN_PASSWORD_ENABLED: "adminPasswordEnabled";
        static readonly ADMIN_PASSWORD_AUTO: "adminPasswordAuto";
        static readonly ADMIN_PASSWORD: "adminPassword";
        static readonly ADMIN_AUTO_LOGON_ENABLED: "adminAutoLogonEnabled";
        static readonly ADMIN_AUTO_LOGON_COUNT: "adminAutoLogonCount";
        static readonly RESET_PASSWORD_REQUIRED: "resetPasswordRequired";
        static readonly CUSTOMIZATION_SCRIPT: "customizationScript";
        static readonly COMPUTER_NAME: "computerName";
        static readonly LINK: "link";
        static readonly ANY: "any";
        static readonly HREF: "href";
        static readonly TYPE: "type";
    }
}
