import { ResourceType } from "./ResourceType";
import { ProductSectionType } from "./../schema/ovf/ProductSectionType";
export declare class ProductSectionListType extends ResourceType {
    productSection?: ProductSectionType[];
}
export declare namespace ProductSectionListType {
    class Fields extends ResourceType.Fields {
        static readonly PRODUCT_SECTION: "productSection";
    }
}
