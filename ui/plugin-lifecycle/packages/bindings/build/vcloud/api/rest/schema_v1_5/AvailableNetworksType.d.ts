import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class AvailableNetworksType extends VCloudExtensibleType {
    network?: ReferenceType[];
}
export declare namespace AvailableNetworksType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK: "network";
    }
}
