import { EntityType } from "./../EntityType";
import { AdminFileDescriptorsType } from "./AdminFileDescriptorsType";
import { VersionsType } from "./VersionsType";
export declare class AdminApiDefinitionType extends EntityType {
    entryPoint?: string;
    namespace?: string;
    apiVendor?: string;
    supportedApiVersions?: VersionsType;
    files?: AdminFileDescriptorsType;
}
export declare namespace AdminApiDefinitionType {
    class Fields extends EntityType.Fields {
        static readonly ENTRY_POINT: "entryPoint";
        static readonly NAMESPACE: "namespace";
        static readonly API_VENDOR: "apiVendor";
        static readonly SUPPORTED_API_VERSIONS: "supportedApiVersions";
        static readonly FILES: "files";
    }
}
