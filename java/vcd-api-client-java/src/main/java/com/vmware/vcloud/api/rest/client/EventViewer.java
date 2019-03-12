/* **********************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **********************************************************/
package com.vmware.vcloud.api.rest.client;

import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultEventRecordType;

/**
 * Helper methods to search for events.
 */
public interface EventViewer {

    /**
     * Returns an event of specified type for the specified entity.
     * <p>
     * This method fails if it cannot find the event or if more than one event match the criteria.
     *
     * @param eventType
     *            Event type to match
     * @param entityHref
     *            Entity URL to match
     * @return matching event
     */
    QueryResultEventRecordType getSingleEvent(final String eventType, final String entityHref);

    /**
     * Returns the latest event of specified type.
     * <p>
     * This method fails if there are no events of the specified type.
     *
     * @param eventType
     *            Event type to match
     * @return matching event
     */
    QueryResultEventRecordType getLatestEvent(final String eventType);
}
