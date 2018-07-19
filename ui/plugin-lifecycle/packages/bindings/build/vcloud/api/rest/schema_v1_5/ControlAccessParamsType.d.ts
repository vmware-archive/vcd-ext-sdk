import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { AccessSettingsType } from "./AccessSettingsType";
export declare class ControlAccessParamsType extends VCloudExtensibleType {
    isSharedToEveryone?: boolean;
    everyoneAccessLevel?: string;
    accessSettings?: AccessSettingsType;
}
export declare namespace ControlAccessParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_SHARED_TO_EVERYONE: "isSharedToEveryone";
        static readonly EVERYONE_ACCESS_LEVEL: "everyoneAccessLevel";
        static readonly ACCESS_SETTINGS: "accessSettings";
    }
}
