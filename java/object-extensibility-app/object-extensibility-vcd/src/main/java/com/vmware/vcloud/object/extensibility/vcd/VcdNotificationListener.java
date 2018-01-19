/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd;

import com.vmware.vcloud.object.extensibility.vcd.event.VcdEvent;

/**
 * Interface that defines functions for interacting with vCloud Directors AMQP-
 * based notifications feature. <p>
 *
 * The interface contract allows a caller to enable notifications just for the entities
 * that it cares about.  Implementations must bind to all possible events for those
 * enabled {@link EntityType}s.  For example, enabling notifications for {@link EntityType#VC}
 * must enable notifications for all the VC event types:
 * <ul>
 *   <li>vc/create</li>
 *   <li>vc/modify</li>
 *   <li>vc/delete</li>
 * </ul>
 */
public interface VcdNotificationListener {
    /**
     * Entities that are recognized by the {@link VcdNotificationListener}
     */
    enum EntityType {
        VC("vc");

        private final String key;

        private EntityType(final String key) {
            this.key = key;
        }

        public String getKey() {
            return key;
        }
    }

    /**
     * Instructs the vCloud Director listener to listen for events of the specified entity types. <p>
     *
     * The {@link VcdNotificationListener} instance will only bind to, and listen for notification messages
     * for entities that have been explicitly enabled via this method.
     *
     * @param entityTypes the types of entities to receive notification events for
     */
    void enableNotificationsForEntities(EntityType... entityTypes);

    /**
     * Registers an object that can handle some set of {@link VcdEvent} subclasses. <p>
     *
     * This method does not assume any particular mechanism for how events will be sent to
     * the registered handler; that is left as an implementation decision.
     *
     * @param handler an object that will process {@link VcdEvent}s
     * @see com.vmware.vcloud.object.extensibility.vcd.event
     */
    void registerEventHandler(final Object handler);
}
