/* ********************************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ********************************************************/
package com.vmware.vcloud.object.extensibility.amqp.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Binding.DestinationType;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.support.converter.ContentTypeDelegatingMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

import com.vmware.vcloud.object.extensibility.amqp.AmqpManager;

public class AmqpManagerImpl implements AmqpManager {

    private final Logger logger = LoggerFactory.getLogger(AmqpManagerImpl.class);

    private RabbitAdmin rabbitAdmin;
    private ConnectionFactory connectionFactory;


    @Override
    public void configure(String host, String user, String password) {
        logger.info("Configuring AMQ host. host: {}, user: {}", 
                host, user);
        this.connectionFactory = createRabbitConnectionFactory(host, user, password);
        this.rabbitAdmin = new RabbitAdmin(connectionFactory);
    }

    @Override
    public SimpleMessageListenerContainer registerObjectExtensionListener(
            String exchangeName,
            String queueName,
            String routingKey,
            Object messageConsumer,
            String consumerMethodName,
            ContentType contentType,
            int concurrentConsumers) {
        
        MessageConverter msgConverter = ContentType.JSON.equals(contentType) ? 
                new ObjectExtensionJsonMessageConverter() : new ObjectExtensionXMLMessageConverter();

        return registerListener(exchangeName, queueName, routingKey, messageConsumer,
                consumerMethodName, concurrentConsumers, msgConverter);
    }
    
    @Override
    public SimpleMessageListenerContainer registerNotificationListener(String exchangeName,
            String queueName, String routingKey, Object messageConsumer,
            String consumerMethodName, int concurrentConsumers) {
        ContentTypeDelegatingMessageConverter msgConverter = new ContentTypeDelegatingMessageConverter();
        msgConverter.addDelgate(MessageProperties.CONTENT_TYPE_JSON, new JsonToMapMessageConverter());

        return registerListener(exchangeName, queueName, routingKey, messageConsumer,
                consumerMethodName, concurrentConsumers, msgConverter);
    }

    @Override
    public SimpleMessageListenerContainer registerListener(String exchangeName, String queueName,
            String routingKey, Object messageConsumer, String consumerMethodName, int concurrentConsumers,
            final MessageConverter msgConverter) {
        logger.info("Declaring RMQ objects. exchange: {}, queue: {}, binding routingKey: {}",
                exchangeName, queueName, routingKey);

        rabbitAdmin.declareExchange(new TopicExchange(exchangeName));
        rabbitAdmin.declareQueue(new Queue(queueName, false));
        rabbitAdmin.declareBinding(new Binding(queueName, DestinationType.QUEUE, exchangeName, routingKey, null));

        logger.info("Creating AMQP listener. exchange: {}, queue: {}, routingKey: {}",
                exchangeName, queueName, routingKey);

        final SimpleMessageListenerContainer container = createMessageListenerContainer(queueName);
        final MessageListenerAdapter messageListenerAdapter = new MessageListenerAdapter(messageConsumer);
        messageListenerAdapter.setDefaultListenerMethod(consumerMethodName);
        messageListenerAdapter.setMessageConverter(msgConverter);
        container.setMessageListener(messageListenerAdapter);
        container.setConcurrentConsumers(concurrentConsumers);
        container.start();

        logger.info("AMQP listener container started. exchange: {}, queue: {}, routingKey: {}",
                exchangeName, queueName, routingKey);

        return container;
    }

    public SimpleMessageListenerContainer createMessageListenerContainer(String queueName) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(queueName);
        return container;
    }

    public ConnectionFactory createRabbitConnectionFactory(String host, String user, String password) {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory(host);
        connectionFactory.setUsername(user);
        connectionFactory.setPassword(password);
        return connectionFactory;
    }
}
