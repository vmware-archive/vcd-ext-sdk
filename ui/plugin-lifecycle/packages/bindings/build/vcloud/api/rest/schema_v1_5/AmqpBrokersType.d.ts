import { ResourceType } from "./ResourceType";
import { AmqpBrokerConfigurationType } from "./AmqpBrokerConfigurationType";
export declare class AmqpBrokersType extends ResourceType {
    amqpBrokerConfiguration?: AmqpBrokerConfigurationType[];
}
export declare namespace AmqpBrokersType {
    class Fields extends ResourceType.Fields {
        static readonly AMQP_BROKER_CONFIGURATION: "amqpBrokerConfiguration";
    }
}
