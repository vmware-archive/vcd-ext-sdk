import { ResourceType } from "./ResourceType";
import { AmqpConfigListType } from "./AmqpConfigListType";
export declare class AmqpComponentConfigurationType extends ResourceType {
    amqpConfigList?: AmqpConfigListType;
    name?: string;
}
export declare namespace AmqpComponentConfigurationType {
    class Fields extends ResourceType.Fields {
        static readonly AMQP_CONFIG_LIST: "amqpConfigList";
        static readonly NAME: "name";
    }
}
