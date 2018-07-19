import { SectionType } from "./../SectionType";
export declare class BootOrderSectionType extends SectionType {
    instanceId?: number;
    type?: string;
}
export declare namespace BootOrderSectionType {
    class Fields extends SectionType.Fields {
        static readonly INSTANCE_ID: "instanceId";
        static readonly TYPE: "type";
    }
}
