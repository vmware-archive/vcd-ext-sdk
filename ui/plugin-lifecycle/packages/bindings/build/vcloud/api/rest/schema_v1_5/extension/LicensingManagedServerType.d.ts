import { VimObjectRefType } from "./VimObjectRefType";
export declare class LicensingManagedServerType {
    vimObjectRef?: VimObjectRefType;
    cpu?: number;
    memoryInstalled?: number;
}
export declare namespace LicensingManagedServerType {
    class Fields {
        static readonly VIM_OBJECT_REF: "vimObjectRef";
        static readonly CPU: "cpu";
        static readonly MEMORY_INSTALLED: "memoryInstalled";
    }
}
