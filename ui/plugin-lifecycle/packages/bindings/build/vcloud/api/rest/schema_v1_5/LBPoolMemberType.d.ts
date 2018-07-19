import { LBPoolServicePortType } from "./LBPoolServicePortType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class LBPoolMemberType extends VCloudExtensibleType {
    ipAddress?: string;
    condition?: string;
    weight?: string;
    servicePort?: LBPoolServicePortType[];
}
export declare namespace LBPoolMemberType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IP_ADDRESS: "ipAddress";
        static readonly CONDITION: "condition";
        static readonly WEIGHT: "weight";
        static readonly SERVICE_PORT: "servicePort";
    }
}
