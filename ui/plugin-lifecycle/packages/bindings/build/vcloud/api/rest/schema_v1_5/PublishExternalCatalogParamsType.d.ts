import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class PublishExternalCatalogParamsType extends VCloudExtensibleType {
    isPublishedExternally?: boolean;
    catalogPublishedUrl?: string;
    password?: string;
    isCacheEnabled?: boolean;
    preserveIdentityInfoFlag?: boolean;
}
export declare namespace PublishExternalCatalogParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_PUBLISHED_EXTERNALLY: "isPublishedExternally";
        static readonly CATALOG_PUBLISHED_URL: "catalogPublishedUrl";
        static readonly PASSWORD: "password";
        static readonly IS_CACHE_ENABLED: "isCacheEnabled";
        static readonly PRESERVE_IDENTITY_INFO_FLAG: "preserveIdentityInfoFlag";
    }
}
