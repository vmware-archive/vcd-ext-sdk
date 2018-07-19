import { VAppCreationParamsType } from "./VAppCreationParamsType";
import { SourcedCompositionItemParamType } from "./SourcedCompositionItemParamType";
import { VmType } from "./VmType";
export declare class ComposeVAppParamsType extends VAppCreationParamsType {
    sourcedItem?: SourcedCompositionItemParamType[];
    createItem?: VmType[];
    allEULAsAccepted?: boolean;
    linkedClone?: boolean;
}
export declare namespace ComposeVAppParamsType {
    class Fields extends VAppCreationParamsType.Fields {
        static readonly SOURCED_ITEM: "sourcedItem";
        static readonly CREATE_ITEM: "createItem";
        static readonly ALL_EU_LAS_ACCEPTED: "allEULAsAccepted";
        static readonly LINKED_CLONE: "linkedClone";
    }
}
