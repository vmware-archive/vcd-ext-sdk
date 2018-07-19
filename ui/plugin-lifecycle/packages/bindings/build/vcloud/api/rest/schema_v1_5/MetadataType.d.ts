import { ResourceType } from "./ResourceType";
import { MetadataEntryType } from "./MetadataEntryType";
export declare class MetadataType extends ResourceType {
    metadataEntry?: MetadataEntryType[];
}
export declare namespace MetadataType {
    class Fields extends ResourceType.Fields {
        static readonly METADATA_ENTRY: "metadataEntry";
    }
}
