import { ResourceType } from "./ResourceType";
export declare class AmqpBrokerConfigurationType extends ResourceType {
    amqpHost?: string;
    amqpPort?: number;
    amqpUsername?: string;
    amqpPassword?: string;
    amqpVHost?: string;
    amqpUseSSL?: boolean;
    amqpSslAcceptAll?: boolean;
}
export declare namespace AmqpBrokerConfigurationType {
    class Fields extends ResourceType.Fields {
        static readonly AMQP_HOST: "amqpHost";
        static readonly AMQP_PORT: "amqpPort";
        static readonly AMQP_USERNAME: "amqpUsername";
        static readonly AMQP_PASSWORD: "amqpPassword";
        static readonly AMQP_VHOST: "amqpVHost";
        static readonly AMQP_USE_SS_L: "amqpUseSSL";
        static readonly AMQP_SSL_ACCEPT_ALL: "amqpSslAcceptAll";
    }
}
