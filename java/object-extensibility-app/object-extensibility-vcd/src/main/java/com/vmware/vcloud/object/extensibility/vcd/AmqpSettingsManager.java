/* *********************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************/
package com.vmware.vcloud.object.extensibility.vcd;

import com.vmware.vcloud.object.extensibility.amqp.AmqpConnectionInfo;

/**
 * Interface that defines functions for interacting with AMQP features
 * of the vCloud API. <p>
 *
 * Before making these calls, the extension must authenticate to the vCloud API as
 * a system administrator.
 */
public interface AmqpSettingsManager {
    /**
     * Gets the AMQP connection details that vCloud Director is currently configured to use.
     *
     * @return AMQP connection details
     */
    AmqpConnectionInfo getAmqpConnectionInfo();

    /**
     * Creates a VcdListener instance that can listen for notifications
     * from a vCloud Director instance. <p>
     *
     * This method must not enable any notification bindings by default; those
     * should be specified by consumers of the listener via the {@link VcdNotificationListener}'s
     * provided interface.
     *
     * @param username username portion of credentials for monitoring notifications
     * @param password password portion of credentials for monitoring notifications
     * @return a listener instance that can monitor vCloud Director notifications
     * @see VcdNotificationListener#enableNotificationsForEntities(com.vmware.vcloud.object.extensibility.vcd.VcdNotificationListener.EntityType...)
     */
    VcdNotificationListener getVcdListener(String username, String password);
}
