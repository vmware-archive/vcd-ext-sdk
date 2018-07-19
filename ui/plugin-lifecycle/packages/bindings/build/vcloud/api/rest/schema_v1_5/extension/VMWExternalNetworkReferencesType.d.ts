import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWExternalNetworkReferencesType extends ResourceType {
    externalNetworkReference?: ReferenceType[];
}
export declare namespace VMWExternalNetworkReferencesType {
    class Fields extends ResourceType.Fields {
        static readonly EXTERNAL_NETWORK_REFERENCE: "externalNetworkReference";
    }
}
