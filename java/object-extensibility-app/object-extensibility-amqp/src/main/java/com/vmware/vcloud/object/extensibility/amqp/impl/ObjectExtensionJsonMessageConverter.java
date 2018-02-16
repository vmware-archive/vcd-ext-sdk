/* *******************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *******************************************/
package com.vmware.vcloud.object.extensibility.amqp.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.support.converter.DefaultJavaTypeMapper;
import org.springframework.amqp.support.converter.MessageConversionException;
import org.springframework.amqp.support.converter.MessageConverter;

/**
 * Manages conversion of of extensibility AMQP messages. Supports conversion to and from JSON
 */
public class ObjectExtensionJsonMessageConverter implements MessageConverter {

    private final Logger logger = LoggerFactory.getLogger(ObjectExtensionJsonMessageConverter.class);
    
    private org.springframework.amqp.support.converter.JsonMessageConverter jsonMessageConverter = 
            new AmqpJsonMessageConverter();
    final ObjectMapper jsonMapper = new ObjectMapper();

    @Override
    public Message toMessage(final Object object, final MessageProperties messageProperties) throws MessageConversionException {

        Objects.requireNonNull(object, "message cannot be null");
        Objects.requireNonNull(messageProperties, "message properties cannot be null");
        Objects.requireNonNull(messageProperties.getContentType(), "message content type cannot be null");

        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
        
        return jsonMessageConverter.toMessage(object, messageProperties);
    }

    @Override
    public Object fromMessage(final Message message) throws MessageConversionException {

        try {
            Objects.requireNonNull(message, "message cannot be null");
            Objects.requireNonNull(message.getMessageProperties(), "message properties cannot be null");
            Objects.requireNonNull(message.getMessageProperties().getContentType(), "message content type cannot be null");
            
            Object jsonObject = jsonMapper.readValue(message.getBody(), Object.class);
            String formattedJsonMsg = jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonObject);
            logger.info("Converting AMQP JSON message:\n {}", formattedJsonMsg);

            final Object responseMessage = jsonMessageConverter.fromMessage(message);

            if (responseMessage != null && RuntimeException.class.isAssignableFrom(responseMessage.getClass())) {
                throw (RuntimeException) responseMessage;
            }

            return responseMessage;
        } catch (Exception e) {
            logger.error("Unexpected exception processing incoming AMQP message. Returning null", e);
            return null;
        }
    }
    
    class AmqpJsonMessageConverter extends org.springframework.amqp.support.converter.JsonMessageConverter {

        
        @Override
        protected void initializeJsonObjectMapper() {
            final ObjectMapper jsonMapper = new ObjectMapper();
            //jsonMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, true);
            jsonMapper.setSerializationInclusion(Inclusion.NON_NULL);
            this.setJsonObjectMapper(jsonMapper);

            final AmqpMessageTypeMapper typeMapper = new AmqpMessageTypeMapper();
            final Map<String, Class<?>> mappings = new HashMap<>();
            typeMapper.setIdClassMapping(mappings);
            this.setJavaTypeMapper(typeMapper);
        }
    }
    
    class AmqpMessageTypeMapper extends DefaultJavaTypeMapper {

        @Override
        public String getClassIdFieldName() {
            return "messageType";
        }
    }
}
