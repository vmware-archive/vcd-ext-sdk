/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vmware.vcloud.extensibility.platform.Requirements;
import com.vmware.vcloud.object.extensibility.amqp.AmqpManager;
import com.vmware.vcloud.object.extensibility.amqp.impl.AmqpManagerImpl;

/**
 * Hello world object extension for the Requirements gathering phase. Receives Requirements
 * extension message and responds back with the same unmodified requirements. The RMQ credentials
 * are passed as arguments to the application
 */
public class HelloWorldAsyncRequirementsObjectExtension {

    private final static Logger logger = LoggerFactory.getLogger(HelloWorldAsyncRequirementsObjectExtension.class);


    public static void main(String[] args) {
        if (args.length != 3) {
            logger.error("Invalid arguments. Following 3 arguments must be supplied: rmqHost rmqUser rmqPassword");
            return;
        }
        new HelloWorldAsyncRequirementsObjectExtension().registerListener(args[0], args[1], args[2]);
    }

    /**
     * Registers a listener using the supplied RMQ credentials. Exchange, queue and routing info are
     * hard coded. The exchange value should match what is used during Object Extension registration
     */
    void registerListener(String rmqHost, String rmqUser, String rmqPassword) {
        logger.info("Application started for RMQ: {}@{}", rmqUser, rmqHost);

        AmqpManager amqpManager = new AmqpManagerImpl();
        amqpManager.configure(rmqHost, rmqUser, rmqPassword);
        amqpManager.registerObjectExtensionListener(
                "reference-service-exchange",
                "reference-service-async-req-json-queue",
                "urn:extensionPoint:vm:gatherRequirements",
                this,
                "handleRequirementsMessage",
                AmqpManager.ContentType.JSON,
                1);
    }

    /**
     * Callback method that gets invoked when an AMQP message is received. The return method is used
     * to reply back to VCD. For a blocking extension, VCD will wait or eventually and fail after a
     * timeout period if nothing is returned
     *
     * @param vcdRequirementsMessage
     *            set of requirements sent from VCD during a create VM workflow
     * @return requirements that VCD should use for VM creation. Can contain modifications if
     *         desired
     */
    public void handleRequirementsMessage(Requirements vcdRequirementsMessage) {
        logger.info("Received Object Extension requirements message from VCD: {}", vcdRequirementsMessage);
    }
}
