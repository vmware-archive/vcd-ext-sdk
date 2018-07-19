import { ResourceType } from "./ResourceType";
export declare class BootOptionsType extends ResourceType {
    bootDelay?: number;
    enterBIOSSetup?: boolean;
}
export declare namespace BootOptionsType {
    class Fields extends ResourceType.Fields {
        static readonly BOOT_DELAY: "bootDelay";
        static readonly ENTER_BI_OS_SETUP: "enterBIOSSetup";
    }
}
