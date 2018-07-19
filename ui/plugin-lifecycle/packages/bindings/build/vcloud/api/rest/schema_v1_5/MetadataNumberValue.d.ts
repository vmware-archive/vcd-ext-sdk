import { MetadataTypedValue } from "./MetadataTypedValue";
export declare class MetadataNumberValue extends MetadataTypedValue {
    value?: number;
}
export declare namespace MetadataNumberValue {
    class Fields extends MetadataTypedValue.Fields {
        static readonly VALUE: "value";
    }
}
