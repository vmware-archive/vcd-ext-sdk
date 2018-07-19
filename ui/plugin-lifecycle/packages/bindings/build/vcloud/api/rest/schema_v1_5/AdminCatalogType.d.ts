import { CatalogType } from "./CatalogType";
import { PublishExternalCatalogParamsType } from "./PublishExternalCatalogParamsType";
import { CatalogStorageProfilesType } from "./CatalogStorageProfilesType";
import { ExternalCatalogSubscriptionParamsType } from "./ExternalCatalogSubscriptionParamsType";
export declare class AdminCatalogType extends CatalogType {
    catalogStorageProfiles?: CatalogStorageProfilesType;
    externalCatalogSubscriptionParams?: ExternalCatalogSubscriptionParamsType;
    publishExternalCatalogParams?: PublishExternalCatalogParamsType;
}
export declare namespace AdminCatalogType {
    class Fields extends CatalogType.Fields {
        static readonly CATALOG_STORAGE_PROFILES: "catalogStorageProfiles";
        static readonly EXTERNAL_CATALOG_SUBSCRIPTION_PARAMS: "externalCatalogSubscriptionParams";
        static readonly PUBLISH_EXTERNAL_CATALOG_PARAMS: "publishExternalCatalogParams";
    }
}
