/* **********************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **********************************************************/
package com.vmware.vcloud.api.rest.client.impl;

import java.util.ListIterator;
import java.util.Objects;

import com.vmware.vcloud.api.rest.client.EventViewer;
import com.vmware.vcloud.api.rest.client.VcdClient;
import com.vmware.vcloud.api.rest.client.VcdClient.QueryListPage;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultEventRecordType;

public class EventViewerImpl implements EventViewer {
    private final VcdClient client;

    private static final String EVENT_QUERY_TYPE_NAME = "event";

    public EventViewerImpl(final VcdClient client) {
        this.client = Objects.requireNonNull(client);
    }

    @Override
    public QueryResultEventRecordType getSingleEvent(final String eventType,
            final String entityHref) {
        final ListIterator<QueryListPage<QueryResultEventRecordType>> it =
                client.getQuery(EVENT_QUERY_TYPE_NAME, QueryResultEventRecordType.class)
                        .setFilter("eventType=="
                        + eventType + ";entity==" + entityHref).execute();

        if (!it.hasNext()) {
            throw new RuntimeException("Event '" + eventType + "' for entity '"
                    + entityHref + "' not found.");
        }

        final QueryListPage<QueryResultEventRecordType> events = it.next();
        final long eventCount = events.getTotalItemCount();

        if (eventCount > 1) {
            throw new RuntimeException("Found multiple (" + eventCount
                    + ") events of type '" + eventType + "' for entity '" + entityHref
                    + "' when expected only one.");
        }

        final QueryResultEventRecordType event = events.getPage().get(0);
        return event;
    }

    @Override
    public QueryResultEventRecordType getLatestEvent(final String eventType) {

        final ListIterator<QueryListPage<QueryResultEventRecordType>> it =
                client.getQuery(EVENT_QUERY_TYPE_NAME, QueryResultEventRecordType.class)
                        .setFilter("eventType=="
                        + eventType).setSortDesc("timeStamp").execute();


        if (!it.hasNext()) {
            throw new RuntimeException("Event '" + eventType + "' not found.");
        }

        final QueryListPage<QueryResultEventRecordType> events = it.next();

        //return latest event
        return events.getPage().get(0);
    }
}
