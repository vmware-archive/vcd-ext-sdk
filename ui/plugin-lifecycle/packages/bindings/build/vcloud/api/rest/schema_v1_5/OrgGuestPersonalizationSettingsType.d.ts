import { ResourceType } from "./ResourceType";
export declare class OrgGuestPersonalizationSettingsType extends ResourceType {
    domainUsername?: string;
    domainPassword?: string;
    domainName?: string;
    allowDomainSettings?: boolean;
    accountOrganizationalUnit?: string;
}
export declare namespace OrgGuestPersonalizationSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly DOMAIN_USERNAME: "domainUsername";
        static readonly DOMAIN_PASSWORD: "domainPassword";
        static readonly DOMAIN_NAME: "domainName";
        static readonly ALLOW_DOMAIN_SETTINGS: "allowDomainSettings";
        static readonly ACCOUNT_ORGANIZATIONAL_UNIT: "accountOrganizationalUnit";
    }
}
