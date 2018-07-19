import { AmqpComponentConfigurationsType } from "./AmqpComponentConfigurationsType";
import { ResourceType } from "./ResourceType";
import { AmqpBrokersType } from "./AmqpBrokersType";
export declare class AmqpConfigurationType extends ResourceType {
    amqpBrokers?: AmqpBrokersType;
    amqpComponentConfigurations?: AmqpComponentConfigurationsType;
}
export declare namespace AmqpConfigurationType {
    class Fields extends ResourceType.Fields {
        static readonly AMQP_BROKERS: "amqpBrokers";
        static readonly AMQP_COMPONENT_CONFIGURATIONS: "amqpComponentConfigurations";
    }
}
