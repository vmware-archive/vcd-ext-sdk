import { VAppCreationParamsType } from "./VAppCreationParamsType";
import { SourcedCompositionItemParamType } from "./SourcedCompositionItemParamType";
import { SourcedVmInstantiationParamsType } from "./SourcedVmInstantiationParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class InstantiateVAppParamsType extends VAppCreationParamsType {
    source?: ReferenceType;
    isSourceDelete?: boolean;
    sourcedVmInstantiationParams?: SourcedVmInstantiationParamsType[];
    sourcedItem?: SourcedCompositionItemParamType[];
    linkedClone?: boolean;
}
export declare namespace InstantiateVAppParamsType {
    class Fields extends VAppCreationParamsType.Fields {
        static readonly SOURCE: "source";
        static readonly IS_SOURCE_DELETE: "isSourceDelete";
        static readonly SOURCED_VM_INSTANTIATION_PARAMS: "sourcedVmInstantiationParams";
        static readonly SOURCED_ITEM: "sourcedItem";
        static readonly LINKED_CLONE: "linkedClone";
    }
}
