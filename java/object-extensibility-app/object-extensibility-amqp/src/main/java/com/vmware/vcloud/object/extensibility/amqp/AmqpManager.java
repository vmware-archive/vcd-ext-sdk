/* ********************************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ********************************************************/
package com.vmware.vcloud.object.extensibility.amqp;

import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.MessageConverter;

/**
 * AMQP Manager provides an interface to configure the RMQ host and credentials and register a
 * listener for a specific named exchange, queue and routing key combo
 */
public interface AmqpManager {

    enum ContentType {XML, JSON}

    /**
     * Configures ObjectExtensionAmqpManager with credentials for connecting to RMQ server
     *
     * @param host
     *            RMQ host name or IP address
     * @param user
     *            user name for RMQ connection
     * @param pasword
     *            password for RMQ connection
     */
    public void configure(String host, String user, String pasword);

    /**
     * Register a listener for Object Extension messages. Messages processed from this queue are
     * expected to conform to the published schema for the Object Extension feature. Message
     * conversion is automatically handled by the AMQP manager and supports either of the available
     * XML/JSON message types based on the message content header of each message
     *
     * @param exchangeName
     *            exchange name used in Object extension registration. Exchange will be created if
     *            it does not already exist
     * @param queueName
     *            queue name where incoming messages are routed to and consumed from. Queue will be
     *            created if it it does not already exist
     * @param routingKey
     *            routing key used for queue binding. Only messages sent with this routing key will
     *            get routed to the queue. This value should match the specific routing key
     *            associated with the Object Extension phase the consumer wants to handle
     * @param messageConsumer
     *            callback object which is invoked upon receiving a message destined for the object
     *            extension
     * @param consumerMethodName
     *            callback method name that should be invoked on the messageConsumer
     * @param contentType
     *            expected content type for AMQP messages. Should match the value supplied during
     *            Object Extension registration
     * @param concurrentConsumers
     *            number of concurrent consumers that can process incoming messages. Each message
     *            will be consumed on a separate thread. See {@link SimpleMessageListenerContainer}
     *            .setConcurrentConsumers for more info
     * @return {@link SimpleMessageListenerContainer} reference for the listener. The client does
     *         not need this but can use it to access connection information or stop the listener if
     *         desired
     */
    public SimpleMessageListenerContainer registerObjectExtensionListener(
            String exchangeName,
            String queueName,
            String routingKey,
            Object messageConsumer,
            String consumerMethodName,
            ContentType contentType,
            int concurrentConsumers);

    /**
     * Register a listener to receive VCloud Director notifications. Message conversion is handled by the AMQP
     * manager.
     *
     * @param exchangeName
     *            exchange name used in Object extension registration. Exchange will be created if
     *            it does not already exist
     * @param queueName
     *            queue name where incoming messages are routed to and consumed from. Queue will be
     *            created if it it does not already exist
     * @param routingKey
     *            routing key used for queue binding. Only messages sent with this routing key will
     *            get routed to the queue. This value should match the specific routing key
     *            associated with the Object Extension phase the consumer wants to handle
     * @param messageConsumer
     *            callback object which is invoked upon receiving a message destined for the object
     *            extension
     * @param consumerMethodName
     *            callback method name that should be invoked on the messageConsumer
     * @param concurrentConsumers
     *            number of concurrent consumers that can process incoming messages. Each message
     *            will be consumed on a separate thread. See {@link SimpleMessageListenerContainer}
     *            .setConcurrentConsumers for more info
     * @return {@link SimpleMessageListenerContainer} reference for the listener. The client does
     *         not need this but can use it to access connection information or stop the listener if
     *         desired
     */
    public SimpleMessageListenerContainer registerNotificationListener(
            String exchangeName,
            String queueName,
            String routingKey,
            Object messageConsumer,
            String consumerMethodName,
            int concurrentConsumers);

    /**
     * Register an AMQP listener using the specified message {@link MessageConverter}.
     *
     * @param exchangeName
     *            exchange name used in Object extension registration. Exchange will be created if
     *            it does not already exist
     * @param queueName
     *            queue name where incoming messages are routed to and consumed from. Queue will be
     *            created if it it does not already exist
     * @param routingKey
     *            routing key used for queue binding. Only messages sent with this routing key will
     *            get routed to the queue. This value should match the specific routing key
     *            associated with the Object Extension phase the consumer wants to handle
     * @param messageConsumer
     *            callback object which is invoked upon receiving a message destined for the object
     *            extension
     * @param consumerMethodName
     *            callback method name that should be invoked on the messageConsumer
     * @param concurrentConsumers
     *            number of concurrent consumers that can process incoming messages. Each message
     *            will be consumed on a separate thread. See {@link SimpleMessageListenerContainer}
     *            .setConcurrentConsumers for more info
     * @param messagConverter message converter to use
     * @return {@link SimpleMessageListenerContainer} reference for the listener. The client does
     *         not need this but can use it to access connection information or stop the listener if
     *         desired
     */
    public SimpleMessageListenerContainer registerListener(
            String exchangeName,
            String queueName,
            String routingKey,
            Object messageConsumer,
            String consumerMethodName,
            int concurrentConsumers,
            MessageConverter messagConverter);
}
