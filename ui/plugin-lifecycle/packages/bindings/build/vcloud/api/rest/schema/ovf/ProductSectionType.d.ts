import { ProductSectionIcon } from "./ProductSectionIcon";
import { CimString } from "./CimString";
import { MsgType } from "./MsgType";
import { SectionType } from "./SectionType";
export declare class ProductSectionType extends SectionType {
    product?: MsgType;
    vendor?: MsgType;
    version?: CimString;
    fullVersion?: CimString;
    productUrl?: CimString;
    vendorUrl?: CimString;
    appUrl?: CimString;
    icon?: ProductSectionIcon[];
    categoryOrProperty?: object[];
    any?: object[];
    clazz?: string;
    instance?: string;
}
export declare namespace ProductSectionType {
    class Fields extends SectionType.Fields {
        static readonly PRODUCT: "product";
        static readonly VENDOR: "vendor";
        static readonly VERSION: "version";
        static readonly FULL_VERSION: "fullVersion";
        static readonly PRODUCT_URL: "productUrl";
        static readonly VENDOR_URL: "vendorUrl";
        static readonly APP_URL: "appUrl";
        static readonly ICON: "icon";
        static readonly CATEGORY_OR_PROPERTY: "categoryOrProperty";
        static readonly ANY: "any";
        static readonly CLAZZ: "clazz";
        static readonly INSTANCE: "instance";
    }
}
