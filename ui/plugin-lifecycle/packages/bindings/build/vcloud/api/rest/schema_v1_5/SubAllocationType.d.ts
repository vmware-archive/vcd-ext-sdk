import { IpRangesType } from "./IpRangesType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class SubAllocationType extends VCloudExtensibleType {
    edgeGateway?: ReferenceType;
    ipRanges?: IpRangesType;
}
export declare namespace SubAllocationType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly EDGE_GATEWAY: "edgeGateway";
        static readonly IP_RANGES: "ipRanges";
    }
}
