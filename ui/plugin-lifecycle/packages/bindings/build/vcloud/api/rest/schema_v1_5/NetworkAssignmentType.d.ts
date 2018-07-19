import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class NetworkAssignmentType extends VCloudExtensibleType {
    containerNetwork?: string;
    innerNetwork?: string;
}
export declare namespace NetworkAssignmentType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CONTAINER_NETWORK: "containerNetwork";
        static readonly INNER_NETWORK: "innerNetwork";
    }
}
