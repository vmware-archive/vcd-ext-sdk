import { VimObjectRefType } from "./VimObjectRefType";
export declare class VmObjectRefType extends VimObjectRefType {
    name?: string;
}
export declare namespace VmObjectRefType {
    class Fields extends VimObjectRefType.Fields {
        static readonly NAME: "name";
    }
}
