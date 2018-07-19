import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class IpRangeType extends VCloudExtensibleType {
    startAddress?: string;
    endAddress?: string;
}
export declare namespace IpRangeType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly START_ADDRESS: "startAddress";
        static readonly END_ADDRESS: "endAddress";
    }
}
