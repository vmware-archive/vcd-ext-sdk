import { VersionInfoType } from "./VersionInfoType";
export declare class SupportedVersionsType {
    versionInfo?: VersionInfoType[];
    any?: object[];
    otherAttributes?: object;
}
export declare namespace SupportedVersionsType {
    class Fields {
        static readonly VERSION_INFO: "versionInfo";
        static readonly ANY: "any";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
