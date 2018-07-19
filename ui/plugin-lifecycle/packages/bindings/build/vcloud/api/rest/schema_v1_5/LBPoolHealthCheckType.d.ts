import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class LBPoolHealthCheckType extends VCloudExtensibleType {
    mode?: string;
    uri?: string;
    healthThreshold?: string;
    unhealthThreshold?: string;
    interval?: string;
    timeout?: string;
}
export declare namespace LBPoolHealthCheckType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MODE: "mode";
        static readonly URI: "uri";
        static readonly HEALTH_THRESHOLD: "healthThreshold";
        static readonly UNHEALTH_THRESHOLD: "unhealthThreshold";
        static readonly INTERVAL: "interval";
        static readonly TIMEOUT: "timeout";
    }
}
