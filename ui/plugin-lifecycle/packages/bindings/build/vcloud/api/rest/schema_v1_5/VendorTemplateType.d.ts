import { VendorTemplateAttributesType } from "./VendorTemplateAttributesType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class VendorTemplateType extends VCloudExtensibleType {
    name?: string;
    id?: string;
    vendorTemplateAttributes?: VendorTemplateAttributesType[];
}
export declare namespace VendorTemplateType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly ID: "id";
        static readonly VENDOR_TEMPLATE_ATTRIBUTES: "vendorTemplateAttributes";
    }
}
