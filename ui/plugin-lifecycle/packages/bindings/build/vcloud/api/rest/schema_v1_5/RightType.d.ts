import { EntityType } from "./EntityType";
export declare class RightType extends EntityType {
    category?: string;
    bundleKey?: string;
    serviceNamespace?: string;
}
export declare namespace RightType {
    class Fields extends EntityType.Fields {
        static readonly CATEGORY: "category";
        static readonly BUNDLE_KEY: "bundleKey";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
    }
}
