import { IdentifiableResourceType } from "./IdentifiableResourceType";
import { PhasesType } from "./PhasesType";
export declare class SelectorExtensionType extends IdentifiableResourceType {
    enabled?: boolean;
    priority?: number;
    objectExtensionId?: string;
    phases?: PhasesType;
}
export declare namespace SelectorExtensionType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly ENABLED: "enabled";
        static readonly PRIORITY: "priority";
        static readonly OBJECT_EXTENSION_ID: "objectExtensionId";
        static readonly PHASES: "phases";
    }
}
