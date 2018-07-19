import { VmType } from "./VmType";
import { ComposeVAppParamsType } from "./ComposeVAppParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class RecomposeVAppParamsType extends ComposeVAppParamsType {
    deleteItem?: ReferenceType[];
    reconfigureItem?: VmType[];
}
export declare namespace RecomposeVAppParamsType {
    class Fields extends ComposeVAppParamsType.Fields {
        static readonly DELETE_ITEM: "deleteItem";
        static readonly RECONFIGURE_ITEM: "reconfigureItem";
    }
}
