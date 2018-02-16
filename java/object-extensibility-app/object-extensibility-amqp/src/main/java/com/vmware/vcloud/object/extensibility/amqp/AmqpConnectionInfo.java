/* *********************************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************/
package com.vmware.vcloud.object.extensibility.amqp;

/**
 * Interface that defines the details needed to create an AMQP connection.
 */
public interface AmqpConnectionInfo {
    /**
     * Gets the AMQP host.
     *
     * @return host string
     */
    String getHost();

    /**
     * Gets the AMQP port
     *
     * @return port number
     */
    int getPort();

    /**
     * Gets a flag indicating whether or not to use SSL for AMQP connections.
     *
     * @return true for SSL, false otherwise
     */
    boolean getUseSsl();

    /**
     * Gets a flag indicating whether or not the AMQP connections can
     * be configured to accept all SSL certificates.
     *
     * @return true if accept all is supported, false otherwise
     */
    boolean getSslAcceptAll();
}
