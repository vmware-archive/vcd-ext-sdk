import { VimObjectRefType } from "./VimObjectRefType";
import { ReferenceType } from "./../ReferenceType";
export declare class MigrateParamsType {
    vmRef?: ReferenceType[];
    resourcePoolRef?: VimObjectRefType;
}
export declare namespace MigrateParamsType {
    class Fields {
        static readonly VM_REF: "vmRef";
        static readonly RESOURCE_POOL_REF: "resourcePoolRef";
    }
}
