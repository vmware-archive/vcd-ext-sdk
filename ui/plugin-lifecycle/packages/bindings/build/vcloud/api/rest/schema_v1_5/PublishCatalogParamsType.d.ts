import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class PublishCatalogParamsType extends VCloudExtensibleType {
    isPublished?: boolean;
}
export declare namespace PublishCatalogParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_PUBLISHED: "isPublished";
    }
}
