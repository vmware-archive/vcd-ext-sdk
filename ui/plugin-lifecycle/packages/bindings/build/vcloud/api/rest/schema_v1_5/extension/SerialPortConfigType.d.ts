import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class SerialPortConfigType extends VCloudExtensibleType {
    status?: string;
    startConnected?: boolean;
    allowGuestControl?: boolean;
    direction?: string;
    serviceUri?: string;
    yieldOnPoll?: boolean;
}
export declare namespace SerialPortConfigType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly STATUS: "status";
        static readonly START_CONNECTED: "startConnected";
        static readonly ALLOW_GUEST_CONTROL: "allowGuestControl";
        static readonly DIRECTION: "direction";
        static readonly SERVICE_URI: "serviceUri";
        static readonly YIELD_ON_POLL: "yieldOnPoll";
    }
}
