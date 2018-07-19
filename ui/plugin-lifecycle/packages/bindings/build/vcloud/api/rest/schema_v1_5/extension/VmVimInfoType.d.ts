import { DiskDatastoreType } from "./DiskDatastoreType";
import { VimObjectRefType } from "./VimObjectRefType";
export declare class VmVimInfoType {
    vmVimObjectRef?: VimObjectRefType;
    datastoreVimObjectRef?: VimObjectRefType;
    vmDiskDatastores?: DiskDatastoreType[];
    hostVimObjectRef?: VimObjectRefType;
    virtualDisksMaxChainLength?: number;
}
export declare namespace VmVimInfoType {
    class Fields {
        static readonly VM_VIM_OBJECT_REF: "vmVimObjectRef";
        static readonly DATASTORE_VIM_OBJECT_REF: "datastoreVimObjectRef";
        static readonly VM_DISK_DATASTORES: "vmDiskDatastores";
        static readonly HOST_VIM_OBJECT_REF: "hostVimObjectRef";
        static readonly VIRTUAL_DISKS_MAX_CHAIN_LENGTH: "virtualDisksMaxChainLength";
    }
}
