import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LBPersistenceType } from "./LBPersistenceType";
export declare class LBVirtualServerServiceProfileType extends VCloudExtensibleType {
    isEnabled?: boolean;
    protocol?: string;
    port?: string;
    persistence?: LBPersistenceType;
}
export declare namespace LBVirtualServerServiceProfileType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_ENABLED: "isEnabled";
        static readonly PROTOCOL: "protocol";
        static readonly PORT: "port";
        static readonly PERSISTENCE: "persistence";
    }
}
