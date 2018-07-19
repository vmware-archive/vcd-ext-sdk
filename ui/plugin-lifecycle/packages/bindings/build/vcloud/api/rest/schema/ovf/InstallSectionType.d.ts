import { SectionType } from "./SectionType";
export declare class InstallSectionType extends SectionType {
    any?: object[];
    initialBootStopDelay?: number;
}
export declare namespace InstallSectionType {
    class Fields extends SectionType.Fields {
        static readonly ANY: "any";
        static readonly INITIAL_BOOT_STOP_DELAY: "initialBootStopDelay";
    }
}
