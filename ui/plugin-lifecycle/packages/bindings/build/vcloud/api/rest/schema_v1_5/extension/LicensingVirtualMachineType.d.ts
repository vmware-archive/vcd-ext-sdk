import { VimObjectRefType } from "./VimObjectRefType";
export declare class LicensingVirtualMachineType {
    vimObjectRef?: VimObjectRefType;
    cpu?: number;
    memory?: number;
}
export declare namespace LicensingVirtualMachineType {
    class Fields {
        static readonly VIM_OBJECT_REF: "vimObjectRef";
        static readonly CPU: "cpu";
        static readonly MEMORY: "memory";
    }
}
