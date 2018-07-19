import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class NatVmRuleType extends VCloudExtensibleType {
    externalIpAddress?: string;
    externalPort?: number;
    vAppScopedVmId?: string;
    vmNicId?: number;
    internalPort?: number;
    protocol?: string;
}
export declare namespace NatVmRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly EXTERNAL_IP_ADDRESS: "externalIpAddress";
        static readonly EXTERNAL_PORT: "externalPort";
        static readonly V_APP_SCOPED_VM_ID: "vAppScopedVmId";
        static readonly VM_NIC_ID: "vmNicId";
        static readonly INTERNAL_PORT: "internalPort";
        static readonly PROTOCOL: "protocol";
    }
}
