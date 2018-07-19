import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWNetworkPoolReferencesType extends ResourceType {
    networkPoolReference?: ReferenceType[];
}
export declare namespace VMWNetworkPoolReferencesType {
    class Fields extends ResourceType.Fields {
        static readonly NETWORK_POOL_REFERENCE: "networkPoolReference";
    }
}
