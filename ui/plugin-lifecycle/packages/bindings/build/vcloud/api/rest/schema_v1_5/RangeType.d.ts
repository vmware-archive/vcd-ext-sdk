import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class RangeType extends VCloudExtensibleType {
    begin?: number;
    end?: number;
}
export declare namespace RangeType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly BEGIN: "begin";
        static readonly END: "end";
    }
}
