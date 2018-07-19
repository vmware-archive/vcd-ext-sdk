import { ResourceType } from "./ResourceType";
export declare class HybridSettingsType extends ResourceType {
    cloudProxyBaseUri?: string;
    cloudProxyBaseUriPublicCertChain?: string;
    cloudProxyBaseUriOverride?: string;
    cloudProxyBaseUriPublicCertChainOverride?: string;
    cloudProxyFromCloudTunnelHost?: string;
    cloudProxyFromCloudTunnelHostOverride?: string;
}
export declare namespace HybridSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly CLOUD_PROXY_BASE_URI: "cloudProxyBaseUri";
        static readonly CLOUD_PROXY_BASE_URI_PUBLIC_CERT_CHAIN: "cloudProxyBaseUriPublicCertChain";
        static readonly CLOUD_PROXY_BASE_URI_OVERRIDE: "cloudProxyBaseUriOverride";
        static readonly CLOUD_PROXY_BASE_URI_PUBLIC_CERT_CHAIN_OVERRIDE: "cloudProxyBaseUriPublicCertChainOverride";
        static readonly CLOUD_PROXY_FROM_CLOUD_TUNNEL_HOST: "cloudProxyFromCloudTunnelHost";
        static readonly CLOUD_PROXY_FROM_CLOUD_TUNNEL_HOST_OVERRIDE: "cloudProxyFromCloudTunnelHostOverride";
    }
}
