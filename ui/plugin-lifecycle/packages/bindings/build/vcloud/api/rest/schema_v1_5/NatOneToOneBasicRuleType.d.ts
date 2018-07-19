import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class NatOneToOneBasicRuleType extends VCloudExtensibleType {
    mappingMode?: string;
    externalIpAddress?: string;
    internalIpAddress?: string;
}
export declare namespace NatOneToOneBasicRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MAPPING_MODE: "mappingMode";
        static readonly EXTERNAL_IP_ADDRESS: "externalIpAddress";
        static readonly INTERNAL_IP_ADDRESS: "internalIpAddress";
    }
}
