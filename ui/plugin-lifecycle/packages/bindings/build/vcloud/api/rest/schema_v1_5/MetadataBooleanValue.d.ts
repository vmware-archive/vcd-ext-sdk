import { MetadataTypedValue } from "./MetadataTypedValue";
export declare class MetadataBooleanValue extends MetadataTypedValue {
    value?: boolean;
}
export declare namespace MetadataBooleanValue {
    class Fields extends MetadataTypedValue.Fields {
        static readonly VALUE: "value";
    }
}
