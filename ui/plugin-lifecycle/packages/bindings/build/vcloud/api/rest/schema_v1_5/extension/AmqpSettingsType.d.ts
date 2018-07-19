import { ResourceType } from "./../ResourceType";
export declare class AmqpSettingsType extends ResourceType {
    amqpHost?: string;
    amqpPort?: number;
    amqpUsername?: string;
    amqpPassword?: string;
    amqpExchange?: string;
    amqpVHost?: string;
    amqpUseSSL?: boolean;
    amqpSslAcceptAll?: boolean;
    amqpPrefix?: string;
}
export declare namespace AmqpSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly AMQP_HOST: "amqpHost";
        static readonly AMQP_PORT: "amqpPort";
        static readonly AMQP_USERNAME: "amqpUsername";
        static readonly AMQP_PASSWORD: "amqpPassword";
        static readonly AMQP_EXCHANGE: "amqpExchange";
        static readonly AMQP_VHOST: "amqpVHost";
        static readonly AMQP_USE_SS_L: "amqpUseSSL";
        static readonly AMQP_SSL_ACCEPT_ALL: "amqpSslAcceptAll";
        static readonly AMQP_PREFIX: "amqpPrefix";
    }
}
