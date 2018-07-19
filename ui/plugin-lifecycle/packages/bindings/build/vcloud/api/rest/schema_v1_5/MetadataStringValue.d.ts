import { MetadataTypedValue } from "./MetadataTypedValue";
export declare class MetadataStringValue extends MetadataTypedValue {
    value?: string;
}
export declare namespace MetadataStringValue {
    class Fields extends MetadataTypedValue.Fields {
        static readonly VALUE: "value";
    }
}
