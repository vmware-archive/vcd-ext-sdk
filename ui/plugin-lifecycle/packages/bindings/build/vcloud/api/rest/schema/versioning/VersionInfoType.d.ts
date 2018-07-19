import { MediaTypeMappingType } from "./MediaTypeMappingType";
export declare class VersionInfoType {
    version?: string;
    loginUrl?: string;
    mediaTypeMapping?: MediaTypeMappingType[];
    any?: object[];
    deprecated?: boolean;
    otherAttributes?: object;
}
export declare namespace VersionInfoType {
    class Fields {
        static readonly VERSION: "version";
        static readonly LOGIN_URL: "loginUrl";
        static readonly MEDIA_TYPE_MAPPING: "mediaTypeMapping";
        static readonly ANY: "any";
        static readonly DEPRECATED: "deprecated";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
