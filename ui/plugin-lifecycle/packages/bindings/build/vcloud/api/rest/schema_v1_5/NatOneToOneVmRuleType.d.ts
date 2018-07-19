import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class NatOneToOneVmRuleType extends VCloudExtensibleType {
    mappingMode?: string;
    externalIpAddress?: string;
    vAppScopedVmId?: string;
    vmNicId?: number;
}
export declare namespace NatOneToOneVmRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MAPPING_MODE: "mappingMode";
        static readonly EXTERNAL_IP_ADDRESS: "externalIpAddress";
        static readonly V_APP_SCOPED_VM_ID: "vAppScopedVmId";
        static readonly VM_NIC_ID: "vmNicId";
    }
}
