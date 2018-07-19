import { MetadataTypedValue } from "./MetadataTypedValue";
import { MetadataDomainTagType } from "./MetadataDomainTagType";
import { ResourceType } from "./ResourceType";
export declare class MetadataEntryType extends ResourceType {
    domain?: MetadataDomainTagType;
    key?: string;
    value?: string;
    typedValue?: MetadataTypedValue;
}
export declare namespace MetadataEntryType {
    class Fields extends ResourceType.Fields {
        static readonly DOMAIN: "domain";
        static readonly KEY: "key";
        static readonly VALUE: "value";
        static readonly TYPED_VALUE: "typedValue";
    }
}
