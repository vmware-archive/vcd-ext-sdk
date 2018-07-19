import { AmqpConfigEntryType } from "./AmqpConfigEntryType";
import { ResourceType } from "./ResourceType";
export declare class AmqpConfigListType extends ResourceType {
    configEntry?: AmqpConfigEntryType[];
}
export declare namespace AmqpConfigListType {
    class Fields extends ResourceType.Fields {
        static readonly CONFIG_ENTRY: "configEntry";
    }
}
