import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ExternalCatalogSubscriptionParamsType extends VCloudExtensibleType {
    subscribeToExternalFeeds?: boolean;
    location?: string;
    password?: string;
    expectedSslThumbprint?: string;
    localCopy?: boolean;
}
export declare namespace ExternalCatalogSubscriptionParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SUBSCRIBE_TO_EXTERNAL_FEEDS: "subscribeToExternalFeeds";
        static readonly LOCATION: "location";
        static readonly PASSWORD: "password";
        static readonly EXPECTED_SSL_THUMBPRINT: "expectedSslThumbprint";
        static readonly LOCAL_COPY: "localCopy";
    }
}
