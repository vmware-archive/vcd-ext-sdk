import { SectionType } from "./../SectionType";
export declare class IpAssignmentSectionType extends SectionType {
    protocols?: string;
    schemes?: string;
}
export declare namespace IpAssignmentSectionType {
    class Fields extends SectionType.Fields {
        static readonly PROTOCOLS: "protocols";
        static readonly SCHEMES: "schemes";
    }
}
