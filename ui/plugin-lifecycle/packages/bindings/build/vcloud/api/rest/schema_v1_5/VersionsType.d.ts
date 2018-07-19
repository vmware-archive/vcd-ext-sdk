import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class VersionsType extends VCloudExtensibleType {
    version?: string[];
}
export declare namespace VersionsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VERSION: "version";
    }
}
