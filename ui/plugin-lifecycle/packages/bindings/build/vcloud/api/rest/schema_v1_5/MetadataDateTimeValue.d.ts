import { MetadataTypedValue } from "./MetadataTypedValue";
export declare class MetadataDateTimeValue extends MetadataTypedValue {
    value?: Date;
}
export declare namespace MetadataDateTimeValue {
    class Fields extends MetadataTypedValue.Fields {
        static readonly VALUE: "value";
    }
}
