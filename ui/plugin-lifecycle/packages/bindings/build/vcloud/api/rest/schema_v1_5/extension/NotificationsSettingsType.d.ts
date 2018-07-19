import { ResourceType } from "./../ResourceType";
export declare class NotificationsSettingsType extends ResourceType {
    enableNotifications?: boolean;
}
export declare namespace NotificationsSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly ENABLE_NOTIFICATIONS: "enableNotifications";
    }
}
