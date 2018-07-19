import { AbstractVAppType } from "./AbstractVAppType";
export declare class VmCheckPGCType extends AbstractVAppType {
    checkPostGCStatus?: boolean;
}
export declare namespace VmCheckPGCType {
    class Fields extends AbstractVAppType.Fields {
        static readonly CHECK_POST_GC_STATUS: "checkPostGCStatus";
    }
}
