import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare abstract class NetworkServiceType extends VCloudExtensibleType {
    isEnabled?: boolean;
}
export declare namespace NetworkServiceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_ENABLED: "isEnabled";
    }
}
