import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { VendorTemplateType } from "./VendorTemplateType";
export declare class NetworkServiceInsertionType extends VCloudExtensibleType {
    name?: string;
    id?: string;
    category?: string;
    categoryType?: string;
    vendorTemplates?: VendorTemplateType[];
}
export declare namespace NetworkServiceInsertionType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly ID: "id";
        static readonly CATEGORY: "category";
        static readonly CATEGORY_TYPE: "categoryType";
        static readonly VENDOR_TEMPLATES: "vendorTemplates";
    }
}
