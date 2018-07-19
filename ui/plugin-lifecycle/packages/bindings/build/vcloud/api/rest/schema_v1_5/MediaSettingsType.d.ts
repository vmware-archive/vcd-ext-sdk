import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { MediaStateType } from "./MediaStateType";
import { MediaTypeType } from "./MediaTypeType";
import { ReferenceType } from "./ReferenceType";
export declare class MediaSettingsType extends VCloudExtensibleType {
    deviceId?: string;
    mediaImage?: ReferenceType;
    mediaType?: MediaTypeType;
    mediaState?: MediaStateType;
    unitNumber?: number;
    busNumber?: number;
    adapterType?: string;
}
export declare namespace MediaSettingsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DEVICE_ID: "deviceId";
        static readonly MEDIA_IMAGE: "mediaImage";
        static readonly MEDIA_TYPE: "mediaType";
        static readonly MEDIA_STATE: "mediaState";
        static readonly UNIT_NUMBER: "unitNumber";
        static readonly BUS_NUMBER: "busNumber";
        static readonly ADAPTER_TYPE: "adapterType";
    }
}
