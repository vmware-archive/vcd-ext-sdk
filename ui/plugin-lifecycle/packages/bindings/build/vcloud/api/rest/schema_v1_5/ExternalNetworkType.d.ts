import { NetworkType } from "./NetworkType";
export declare class ExternalNetworkType extends NetworkType {
    providerInfo?: string;
    networkBackingInfo?: string[];
}
export declare namespace ExternalNetworkType {
    class Fields extends NetworkType.Fields {
        static readonly PROVIDER_INFO: "providerInfo";
        static readonly NETWORK_BACKING_INFO: "networkBackingInfo";
    }
}
