import { Selectors } from "./Selectors";
import { IdentifiableResourceType } from "./../IdentifiableResourceType";
export declare class ObjectExtensionType extends IdentifiableResourceType {
    namespace?: string;
    enabled?: boolean;
    exchange?: string;
    contentType?: string;
    vendor?: string;
    selectors?: Selectors;
}
export declare namespace ObjectExtensionType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly NAMESPACE: "namespace";
        static readonly ENABLED: "enabled";
        static readonly EXCHANGE: "exchange";
        static readonly CONTENT_TYPE: "contentType";
        static readonly VENDOR: "vendor";
        static readonly SELECTORS: "selectors";
    }
}
