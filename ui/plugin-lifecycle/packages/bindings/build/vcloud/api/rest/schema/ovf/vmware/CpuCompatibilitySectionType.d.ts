import { SectionType } from "./../SectionType";
import { Level } from "./Level";
export declare class CpuCompatibilitySectionType extends SectionType {
    level?: Level[];
}
export declare namespace CpuCompatibilitySectionType {
    class Fields extends SectionType.Fields {
        static readonly LEVEL: "level";
    }
}
