import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class AuthorizationCheckResponseType extends VCloudExtensibleType {
    isAuthorized?: boolean;
}
export declare namespace AuthorizationCheckResponseType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_AUTHORIZED: "isAuthorized";
    }
}
