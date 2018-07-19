import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class NetworksType extends VCloudExtensibleType {
    network?: ReferenceType[];
}
export declare namespace NetworksType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK: "network";
    }
}
