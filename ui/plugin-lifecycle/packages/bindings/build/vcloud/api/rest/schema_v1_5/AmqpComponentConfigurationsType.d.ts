import { ResourceType } from "./ResourceType";
import { AmqpComponentConfigurationType } from "./AmqpComponentConfigurationType";
export declare class AmqpComponentConfigurationsType extends ResourceType {
    amqpComponentConfiguration?: AmqpComponentConfigurationType[];
}
export declare namespace AmqpComponentConfigurationsType {
    class Fields extends ResourceType.Fields {
        static readonly AMQP_COMPONENT_CONFIGURATION: "amqpComponentConfiguration";
    }
}
