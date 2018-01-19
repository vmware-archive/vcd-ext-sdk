/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.support;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.listener.MessageListenerContainer;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;

import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;
import com.vmware.vcloud.object.extensibility.amqp.AmqpConnectionInfo;
import com.vmware.vcloud.object.extensibility.amqp.AmqpManager;
import com.vmware.vcloud.object.extensibility.amqp.impl.AmqpManagerImpl;
import com.vmware.vcloud.object.extensibility.vcd.VcdNotificationListener;
import com.vmware.vcloud.object.extensibility.vcd.event.VcdEvent;
import com.vmware.vcloud.object.extensibility.vcd.event.vc.VcCreateEvent;
import com.vmware.vcloud.object.extensibility.vcd.event.vc.VcDeleteEvent;
import com.vmware.vcloud.object.extensibility.vcd.event.vc.VcModifyEvent;

/**
 * An implementation of {@link VcdNotificationListener} that uses a Guava-based
 * {@link EventBus} for subscribing to, and publishing, events. <p>
 *
 * Callers of the {@link #registerEventHandler(Object)} method should pass instances
 * of objects that have methods, annotated with the {@link Subscribe} annotation, that take
 * the specific event they care about as a method parameter.  For example, a handler for
 * vCenter events might be implemented as follows:
 * <pre>
 * <code>
 * public class VcEventHandler {
 *     {@literal @Subscribe}
 *     public void handleVcCreate(final VcCreateEvent event) {
 *         // handle VC creation
 *     }
 *
 *     {@literal @Subscribe}
 *     public void handleVcModify(final VcModifyEvent event) {
 *         // handle VC update
 *     }
 *
 *     {@literal @Subscribe}
 *     public void handleVcDelete(final VcDeleteEvent event) {
 *         // handle VC deletion
 *     }
 * }
 * </code>
 * </pre>
 *
 * @see com.vmware.vcloud.object.extensibility.vcd.event
 */
public class VcdNotificationListenerEventBusImpl implements VcdNotificationListener {
    // format: operationSuccess.entity.org.user.subType1.subType2...subTypeN.[taskName]
    private static final String ROUTING_KEY_FORMAT = "#.#.com.vmware.vcloud.event.%s.*";
    private static final Logger LOG = LoggerFactory.getLogger(VcdNotificationListenerEventBusImpl.class);

    private static final Map<String, Class<? extends VcdEvent>> EVENT_MAP;
    static {
        Map<String, Class<? extends VcdEvent>> temp = new HashMap<>();
        temp.put("com/vmware/vcloud/event/vc/create", VcCreateEvent.class);
        temp.put("com/vmware/vcloud/event/vc/modify", VcModifyEvent.class);
        temp.put("com/vmware/vcloud/event/vc/refresh", VcModifyEvent.class);
        temp.put("com/vmware/vcloud/event/vc/delete", VcDeleteEvent.class);

        EVENT_MAP = Collections.unmodifiableMap(temp);
    }

    private final AmqpManager amqpManager;
    private final String notificationExchange;
    private final Map<EntityType, MessageListenerContainer> notificationListeners = new HashMap<>();
    private final EventBus eventBus;

    VcdNotificationListenerEventBusImpl(final AmqpConnectionInfo amqpConnection, final String username, final String password, final String notificationExchange) {
        this.notificationExchange = notificationExchange;

        amqpManager = new AmqpManagerImpl();
        amqpManager.configure(amqpConnection.getHost(), username, password);

        this.eventBus = new EventBus();
    }

    @Override
    public void enableNotificationsForEntities(final EntityType... entityTypes) {
        synchronized (notificationListeners) {
            for (EntityType entityType : entityTypes) {
                if (notificationListeners.get(entityType) == null) {
                    SimpleMessageListenerContainer listener = amqpManager.registerNotificationListener(notificationExchange, "vcdListenerQueue",
                            String.format(ROUTING_KEY_FORMAT, entityType.getKey()), this, "processNotification", 10);

                    notificationListeners.put(entityType, listener);
                }
            }
        }
    }

    /**
     * Registers the specified handler with a Guava {@link EventBus}. <p>
     *
     * The handler instance is expected to contain methods annotated with the
     * {@link Subscribe} annotation to receive events fired from the bus.
     */
    @Override
    public void registerEventHandler(final Object handler) {
        this.eventBus.register(handler);
    }

    /**
     * Callback function to process notification messages received from AMQP.
     *
     * @param notification the event notification details as key/value pairs
     */
    public void processNotification(Map<Object, Object> notification) {
        LOG.trace("Received notification {} from vCloud Director", notification);
        Class<? extends VcdEvent> eventClass = EVENT_MAP.get(notification.get("type"));
        if (eventClass == null) {
            LOG.warn("Ignoring unrecognized notification type {}", notification.get("type"));
            return;
        }

        VcdEvent event;
        try {
            event = eventClass.newInstance();
        } catch (InstantiationException | IllegalAccessException e) {
            LOG.error("Failed to create event of type {}", eventClass, e);
            return;
        }

        event.setEntity(URI.create(notification.get("entity").toString()));
        event.setOperationSuccess(Boolean.parseBoolean(notification.get("operationSuccess").toString()));

        eventBus.post(event);
    }
}
