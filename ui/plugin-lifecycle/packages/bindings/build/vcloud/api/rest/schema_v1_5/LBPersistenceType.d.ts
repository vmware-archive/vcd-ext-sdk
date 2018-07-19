import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class LBPersistenceType extends VCloudExtensibleType {
    method?: string;
    cookieName?: string;
    cookieMode?: string;
}
export declare namespace LBPersistenceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly METHOD: "method";
        static readonly COOKIE_NAME: "cookieName";
        static readonly COOKIE_MODE: "cookieMode";
    }
}
