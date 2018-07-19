import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class NetworkPoolReferencesType extends VCloudExtensibleType {
    networkPoolReference?: ReferenceType[];
}
export declare namespace NetworkPoolReferencesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK_POOL_REFERENCE: "networkPoolReference";
    }
}
