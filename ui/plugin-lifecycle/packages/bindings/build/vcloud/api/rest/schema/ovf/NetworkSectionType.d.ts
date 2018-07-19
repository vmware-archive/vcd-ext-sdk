import { NetworkSectionNetwork } from "./NetworkSectionNetwork";
import { SectionType } from "./SectionType";
export declare class NetworkSectionType extends SectionType {
    network?: NetworkSectionNetwork[];
    any?: object[];
}
export declare namespace NetworkSectionType {
    class Fields extends SectionType.Fields {
        static readonly NETWORK: "network";
        static readonly ANY: "any";
    }
}
