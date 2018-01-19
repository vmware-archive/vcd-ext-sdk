/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vmware.vcloud.extensibility.platform.PlacementProposalType;
import com.vmware.vcloud.object.extensibility.amqp.AmqpManager;
import com.vmware.vcloud.object.extensibility.amqp.impl.AmqpManagerImpl;

/**
 * Hello world object extension for the Calculate Solution phase. Receives proposed solution AMQP
 * messages during VM creation. Phase type registered is 'ASYNC' so vCD does not expect a response
 * from the extension. The message is essentially sent for informational purposes. The RMQ credentials
 * are passed as arguments to the application
 */
public class HelloWorldASyncCalculateSolutionObjectExtension {

    private final static Logger logger = LoggerFactory.getLogger(HelloWorldASyncCalculateSolutionObjectExtension.class);


    public static void main(String[] args) {
        if (args.length != 3) {
            logger.error("Invalid arguments. Following 3 arguments must be supplied: rmqHost rmqUser rmqPassword");
            return;
        }
        new HelloWorldASyncCalculateSolutionObjectExtension().registerListener(args[0], args[1], args[2]);
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
                "reference-service-async-solution-xml-queue",
                "urn:extensionPoint:vm:calculateSolution",
                this,
                "handleSolutionsMessage",
                AmqpManager.ContentType.JSON,
                1);
    }

    /**
     * Callback method that gets invoked when an AMQP message is received.
     * 
     * @param vcdRequirementsMessage
     *            set of requirements sent from VCD during a create VM workflow
     */
    public void handleSolutionsMessage(PlacementProposalType placementProposalType) {
        logger.info("Received Object Extension calculate solution message from VCD. Proposed hub: {}", 
                placementProposalType.getProposedSolution().getSubjectHubAssignment().get(0).getHubUri());
        
        logger.info("ASync extension. No response required");
    }
}
