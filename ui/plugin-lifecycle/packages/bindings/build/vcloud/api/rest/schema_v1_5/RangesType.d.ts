import { RangeType } from "./RangeType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class RangesType extends VCloudExtensibleType {
    range?: RangeType[];
}
export declare namespace RangesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly RANGE: "range";
    }
}
