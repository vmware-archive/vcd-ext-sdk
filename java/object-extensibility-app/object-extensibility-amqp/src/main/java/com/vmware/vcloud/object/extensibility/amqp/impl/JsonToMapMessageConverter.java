/* *********************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************/
package com.vmware.vcloud.object.extensibility.amqp.impl;

import java.io.IOException;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.support.converter.MessageConversionException;
import org.springframework.amqp.support.converter.MessageConverter;

/**
 * Manages conversion of of vCloud Director Notification AMQP messages to a
 * Java map. <p>
 *
 * Conversion from a map to JSON AMQP message is not supported.
 */
public class JsonToMapMessageConverter implements MessageConverter {

    private final Logger logger = LoggerFactory.getLogger(JsonToMapMessageConverter.class);

    @Override
    public Message toMessage(final Object object, final MessageProperties messageProperties) throws MessageConversionException {

        throw new UnsupportedOperationException("Conversion to AMQP message not supported by: " +
                this.getClass().getCanonicalName());
    }

    @Override
    public Object fromMessage(final Message message) throws MessageConversionException {

        try {
            ObjectReader reader = new ObjectMapper().reader(Map.class);

            Map<String, Object> map = reader.readValue(message.getBody());

            return map;

        } catch (IOException e) {
            logger.error("Unexpected exception de-serializing json notification", e);
            return null;
        }
    }
}
