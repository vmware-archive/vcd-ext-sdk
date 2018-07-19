import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { MediaSettingsType } from "./MediaSettingsType";
export declare class MediaSectionType extends VCloudExtensibleType {
    mediaSettings?: MediaSettingsType[];
}
export declare namespace MediaSectionType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MEDIA_SETTINGS: "mediaSettings";
    }
}
