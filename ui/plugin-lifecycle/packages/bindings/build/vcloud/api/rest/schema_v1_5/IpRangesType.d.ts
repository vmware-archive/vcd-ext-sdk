import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { IpRangeType } from "./IpRangeType";
export declare class IpRangesType extends VCloudExtensibleType {
    ipRange?: IpRangeType[];
}
export declare namespace IpRangesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IP_RANGE: "ipRange";
    }
}
