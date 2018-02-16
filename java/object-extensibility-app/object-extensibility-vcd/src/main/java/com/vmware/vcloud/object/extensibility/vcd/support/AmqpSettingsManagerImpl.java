/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.support;

import com.vmware.vcloud.api.rest.client.VcdClient;
import com.vmware.vcloud.api.rest.client.constants.RelationType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.AmqpSettingsType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.SystemSettingsType;
import com.vmware.vcloud.object.extensibility.amqp.AmqpConnectionInfo;
import com.vmware.vcloud.object.extensibility.amqp.impl.DefaultAmqpConnectionInfo;
import com.vmware.vcloud.object.extensibility.vcd.AmqpSettingsManager;
import com.vmware.vcloud.object.extensibility.vcd.VcdNotificationListener;

/**
 * Default implementation of {@link AmqpSettingsManager}.
 */
public class AmqpSettingsManagerImpl implements AmqpSettingsManager {
    private static final String NOTIFICATION_EXCHANGE_ROOT = "notifications20";

    private final VcdClient vcdClient;

    public AmqpSettingsManagerImpl(final VcdClient vcdClient) {
        this.vcdClient = vcdClient;
    }

    @Override
    public AmqpConnectionInfo getAmqpConnectionInfo() {
        return getAmqpConnectionInfo(getAmqpSettingsType());
    }

    @Override
    public VcdNotificationListener getVcdListener(final String username, final String password) {
        AmqpSettingsType amqpSettings = getAmqpSettingsType();
        return new VcdNotificationListenerEventBusImpl(getAmqpConnectionInfo(amqpSettings), username, password, getNotificationExchange(amqpSettings));
    }

    private AmqpSettingsType getAmqpSettingsType() {
        final SystemSettingsType systemSettings = vcdClient.getResource(vcdClient.getExtension(), RelationType.DOWN,
                ExtensionConstants.MediaType.SYSTEM_SETTINGSM, SystemSettingsType.class);
        return vcdClient.getResource(systemSettings, RelationType.DOWN,
                ExtensionConstants.MediaType.AMQP_SETTINGSM, AmqpSettingsType.class);
    }

    private AmqpConnectionInfo getAmqpConnectionInfo(final AmqpSettingsType amqpSettings) {
        return new DefaultAmqpConnectionInfo(amqpSettings.getAmqpHost(), amqpSettings.getAmqpPort(),
                amqpSettings.isAmqpUseSSL(), amqpSettings.isAmqpSslAcceptAll());
    }

    private String getNotificationExchange(final AmqpSettingsType amqpSettings) {
        return String.format("%s.%s", amqpSettings.getAmqpPrefix(), NOTIFICATION_EXCHANGE_ROOT);
    }
}
