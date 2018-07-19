import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LBPoolHealthCheckType } from "./LBPoolHealthCheckType";
export declare class LBPoolServicePortType extends VCloudExtensibleType {
    isEnabled?: boolean;
    protocol?: string;
    algorithm?: string;
    port?: string;
    healthCheckPort?: string;
    healthCheck?: LBPoolHealthCheckType[];
}
export declare namespace LBPoolServicePortType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_ENABLED: "isEnabled";
        static readonly PROTOCOL: "protocol";
        static readonly ALGORITHM: "algorithm";
        static readonly PORT: "port";
        static readonly HEALTH_CHECK_PORT: "healthCheckPort";
        static readonly HEALTH_CHECK: "healthCheck";
    }
}
