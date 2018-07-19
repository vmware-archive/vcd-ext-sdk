import { CimString } from "./../CimString";
import { SectionType } from "./SectionType";
export declare class PlatformSectionType extends SectionType {
    kind?: CimString;
    version?: CimString;
    vendor?: CimString;
    locale?: CimString;
    timezone?: number;
    any?: object[];
}
export declare namespace PlatformSectionType {
    class Fields extends SectionType.Fields {
        static readonly KIND: "kind";
        static readonly VERSION: "version";
        static readonly VENDOR: "vendor";
        static readonly LOCALE: "locale";
        static readonly TIMEZONE: "timezone";
        static readonly ANY: "any";
    }
}
