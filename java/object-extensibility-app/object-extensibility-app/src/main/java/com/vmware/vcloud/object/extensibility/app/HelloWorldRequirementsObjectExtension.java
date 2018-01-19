/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vmware.vcloud.extensibility.platform.ExtensionErrorMessage;
import com.vmware.vcloud.extensibility.platform.Requirements;
import com.vmware.vcloud.object.extensibility.amqp.AmqpManager;
import com.vmware.vcloud.object.extensibility.amqp.impl.AmqpManagerImpl;

/**
 * Hello world object extension for the Requirements gathering phase. Receives Requirements
 * extension message and responds back with the same unmodified requirements. The RMQ credentials
 * are passed as arguments to the application
 */
public class HelloWorldRequirementsObjectExtension {

    private final static Logger logger = LoggerFactory.getLogger(HelloWorldRequirementsObjectExtension.class);


    public static void main(String[] args) {
        if (args.length != 5) {
            logger.error("Invalid arguments. Following 5 arguments must be supplied: "
                    + "rmqHost rmqUser rmqPassword contentType concurrentConsumers");
            return;
        }
        new HelloWorldRequirementsObjectExtension().registerListener(args[0], args[1], args[2], 
                AmqpManager.ContentType.valueOf(args[3]), Integer.parseInt(args[4]));
    }

    /**
     * Registers a listener using the supplied RMQ credentials. Exchange, queue and routing info are
     * hard coded. The exchange value should match what is used during Object Extension registration
     */
    void registerListener(String rmqHost, String rmqUser, String rmqPassword, AmqpManager.ContentType contentType, int concurrentConsumers) {
        logger.info("Application started for RMQ: {}@{}. concurrent consumer count: {}", 
                rmqUser, rmqHost, concurrentConsumers);

        AmqpManager amqpManager = new AmqpManagerImpl();
        amqpManager.configure(rmqHost, rmqUser, rmqPassword);
        amqpManager.registerObjectExtensionListener(
                "reference-service-exchange",
                "reference-service-blocking-req-xml-queue",
                "urn:extensionPoint:vm:gatherRequirements",
                this,
                "handleRequirementsMessage",
                contentType,
                concurrentConsumers);
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
    public Requirements handleRequirementsMessage(Requirements vcdRequirementsMessage) {
        logger.info("Received Object Extension requirements message from VCD: {}", vcdRequirementsMessage);

        logger.info("Replying to VCD with unchanged requirements");
        return vcdRequirementsMessage;
    }
    
    /**
     * Handles error messages sent by vCD to this extension 
     * 
     * @param vcdErrorMessage
     */
    public void handleRequirementsMessage(ExtensionErrorMessage vcdErrorMessage) {
        logger.error("Received extension error message from VCD: {}", vcdErrorMessage.getMessage());
    }
}
