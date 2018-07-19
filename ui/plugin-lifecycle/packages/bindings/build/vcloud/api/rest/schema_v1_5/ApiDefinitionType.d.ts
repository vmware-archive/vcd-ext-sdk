import { VersionsType } from "./VersionsType";
import { EntityType } from "./EntityType";
export declare class ApiDefinitionType extends EntityType {
    entryPoint?: string;
    namespace?: string;
    apiVendor?: string;
    supportedApiVersions?: VersionsType;
}
export declare namespace ApiDefinitionType {
    class Fields extends EntityType.Fields {
        static readonly ENTRY_POINT: "entryPoint";
        static readonly NAMESPACE: "namespace";
        static readonly API_VENDOR: "apiVendor";
        static readonly SUPPORTED_API_VERSIONS: "supportedApiVersions";
    }
}
