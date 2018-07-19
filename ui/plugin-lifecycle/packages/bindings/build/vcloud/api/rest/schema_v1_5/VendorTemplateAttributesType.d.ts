import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class VendorTemplateAttributesType extends VCloudExtensibleType {
    name?: string;
    key?: string;
    value?: string;
}
export declare namespace VendorTemplateAttributesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly KEY: "key";
        static readonly VALUE: "value";
    }
}
