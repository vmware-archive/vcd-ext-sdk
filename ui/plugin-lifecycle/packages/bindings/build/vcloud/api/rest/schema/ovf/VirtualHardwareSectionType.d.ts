import { VSSDType } from "./VSSDType";
import { RASDType } from "./RASDType";
import { SectionType } from "./SectionType";
export declare class VirtualHardwareSectionType extends SectionType {
    system?: VSSDType;
    item?: RASDType[];
    any?: object[];
    id?: string;
    transport?: string;
}
export declare namespace VirtualHardwareSectionType {
    class Fields extends SectionType.Fields {
        static readonly SYSTEM: "system";
        static readonly ITEM: "item";
        static readonly ANY: "any";
        static readonly ID: "id";
        static readonly TRANSPORT: "transport";
    }
}
