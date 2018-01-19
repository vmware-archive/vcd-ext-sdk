/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.app;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vmware.vcloud.object.extensibility.amqp.AmqpManager;
import com.vmware.vcloud.object.extensibility.amqp.impl.AmqpManagerImpl;

/**
 * Consumes vCD notification messages that are published via AMQP messaging
 */
public class NotificationListenerApp {

    private final static Logger logger = LoggerFactory.getLogger(NotificationListenerApp.class);


    public static void main(String[] args) {
        if (args.length != 3) {
            logger.error("Invalid arguments. Following 3 arguments must be supplied: rmqHost rmqUser rmqPassword");
            return;
        }
        new NotificationListenerApp().registerListeners(args[0], args[1], args[2]);
    }

    /**
     * Registers a listener using the supplied RMQ credentials. Exchange, queue and routing info are
     * hard coded. The exchange value should match what is configured for vCD notifications. This is
     * managed via the 'Extensibility' administration page in the vCD UI. Wildcard routing '#' is used
     * to receive all notifications sent to this exchange
     */
    private void registerListeners(String rmqHost, String rmqUser, String rmqPassword) {
        logger.info("Application started for RMQ: {}@{}", rmqUser, rmqHost);

        AmqpManager amqpManager = new AmqpManagerImpl();
        amqpManager.configure(rmqHost, rmqUser, rmqPassword);
        amqpManager.registerNotificationListener(
                "vcd.notifications20",
                "reference-service-notification-queue",
                "#",
                this,
                "handleNotificationMessage",
                1);
    }

    public void handleNotificationMessage(Map<Object, Object> vcdNotificationMessage) {
        logger.info("Received Notification message from VCD: {}", vcdNotificationMessage);
    }
}
