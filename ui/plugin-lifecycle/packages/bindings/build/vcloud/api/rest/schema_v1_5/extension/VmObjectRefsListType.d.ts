import { VmObjectRefType } from "./VmObjectRefType";
export declare class VmObjectRefsListType {
    vmObjectRef?: VmObjectRefType[];
    numberOfPages?: number;
    page?: number;
}
export declare namespace VmObjectRefsListType {
    class Fields {
        static readonly VM_OBJECT_REF: "vmObjectRef";
        static readonly NUMBER_OF_PAGES: "numberOfPages";
        static readonly PAGE: "page";
    }
}
