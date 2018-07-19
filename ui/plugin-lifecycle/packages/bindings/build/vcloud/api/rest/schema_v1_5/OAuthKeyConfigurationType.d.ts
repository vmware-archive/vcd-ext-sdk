import { ResourceType } from "./ResourceType";
export declare class OAuthKeyConfigurationType extends ResourceType {
    keyId?: string;
    algorithm?: string;
    key?: string;
    expirationDate?: Date;
}
export declare namespace OAuthKeyConfigurationType {
    class Fields extends ResourceType.Fields {
        static readonly KEY_ID: "keyId";
        static readonly ALGORITHM: "algorithm";
        static readonly KEY: "key";
        static readonly EXPIRATION_DATE: "expirationDate";
    }
}
