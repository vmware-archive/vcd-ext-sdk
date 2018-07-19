import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class VmSelectionType extends VCloudExtensibleType {
    vAppScopedVmId?: string;
    vmNicId?: number;
    ipType?: string;
}
export declare namespace VmSelectionType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly V_APP_SCOPED_VM_ID: "vAppScopedVmId";
        static readonly VM_NIC_ID: "vmNicId";
        static readonly IP_TYPE: "ipType";
    }
}
