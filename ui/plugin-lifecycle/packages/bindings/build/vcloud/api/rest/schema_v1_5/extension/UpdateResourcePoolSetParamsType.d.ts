import { ParamsType } from "./../ParamsType";
import { VimObjectRefType } from "./VimObjectRefType";
import { ReferenceType } from "./../ReferenceType";
export declare class UpdateResourcePoolSetParamsType extends ParamsType {
    addItem?: VimObjectRefType[];
    deleteItem?: ReferenceType[];
}
export declare namespace UpdateResourcePoolSetParamsType {
    class Fields extends ParamsType.Fields {
        static readonly ADD_ITEM: "addItem";
        static readonly DELETE_ITEM: "deleteItem";
    }
}
