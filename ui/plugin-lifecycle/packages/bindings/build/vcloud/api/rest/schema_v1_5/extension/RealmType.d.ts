import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class RealmType extends VCloudExtensibleType {
    domain?: string[];
    kdc?: string;
    name?: string;
}
export declare namespace RealmType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DOMAIN: "domain";
        static readonly KDC: "kdc";
        static readonly NAME: "name";
    }
}
