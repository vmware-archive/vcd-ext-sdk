import { LBPoolServicePortType } from "./LBPoolServicePortType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LBPoolMemberType } from "./LBPoolMemberType";
export declare class LoadBalancerPoolType extends VCloudExtensibleType {
    id?: string;
    name?: string;
    description?: string;
    servicePort?: LBPoolServicePortType[];
    member?: LBPoolMemberType[];
    operational?: boolean;
    errorDetails?: string;
}
export declare namespace LoadBalancerPoolType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ID: "id";
        static readonly NAME: "name";
        static readonly DESCRIPTION: "description";
        static readonly SERVICE_PORT: "servicePort";
        static readonly MEMBER: "member";
        static readonly OPERATIONAL: "operational";
        static readonly ERROR_DETAILS: "errorDetails";
    }
}
