import { MetadataTypedValue } from "./MetadataTypedValue";
import { MetadataDomainTagType } from "./MetadataDomainTagType";
import { ResourceType } from "./ResourceType";
export declare class MetadataValueType extends ResourceType {
    domain?: MetadataDomainTagType;
    value?: string;
    typedValue?: MetadataTypedValue;
}
export declare namespace MetadataValueType {
    class Fields extends ResourceType.Fields {
        static readonly DOMAIN: "domain";
        static readonly VALUE: "value";
        static readonly TYPED_VALUE: "typedValue";
    }
}
