import { ResourceType } from "./ResourceType";
import { SamlSPKeyAndCertificateChainType } from "./SamlSPKeyAndCertificateChainType";
export declare class OrgFederationSettingsType extends ResourceType {
    samlMetadata?: string;
    enabled?: boolean;
    certificateExpiration?: Date;
    samlSPEntityId?: string;
    roleAttributeName?: string;
    samlSPKeyAndCertificateChain?: SamlSPKeyAndCertificateChainType;
}
export declare namespace OrgFederationSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly SAML_METADATA: "samlMetadata";
        static readonly ENABLED: "enabled";
        static readonly CERTIFICATE_EXPIRATION: "certificateExpiration";
        static readonly SAML_SP_ENTITY_ID: "samlSPEntityId";
        static readonly ROLE_ATTRIBUTE_NAME: "roleAttributeName";
        static readonly SAML_SP_KEY_AND_CERTIFICATE_CHAIN: "samlSPKeyAndCertificateChain";
    }
}
