import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { ReferenceType } from "./../ReferenceType";
export declare class AuthorizationCheckParamsType extends VCloudExtensibleType {
    user?: ReferenceType;
    httpMethod?: string;
    url?: string;
}
export declare namespace AuthorizationCheckParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly USER: "user";
        static readonly HTTP_METHOD: "httpMethod";
        static readonly URL: "url";
    }
}
