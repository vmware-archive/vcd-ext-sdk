import { ResourceType } from "./ResourceType";
export declare class SamlSPKeyAndCertificateChainType extends ResourceType {
    key?: string;
    certificateChain?: string;
}
export declare namespace SamlSPKeyAndCertificateChainType {
    class Fields extends ResourceType.Fields {
        static readonly KEY: "key";
        static readonly CERTIFICATE_CHAIN: "certificateChain";
    }
}
