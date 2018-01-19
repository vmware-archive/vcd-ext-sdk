/* ****************************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ****************************************************/
package com.vmware.vcloud.object.extensibility.amqp.impl;

import com.vmware.vcloud.object.extensibility.amqp.AmqpConnectionInfo;

/**
 * Default implementation of the {@link AmqpConnectionInfo} interface.
 */
public class DefaultAmqpConnectionInfo implements AmqpConnectionInfo {
    private final String host;
    private final int port;
    private final boolean useSsl;
    private final boolean sslAcceptAll;

    public DefaultAmqpConnectionInfo(final String host, final int port, final boolean useSsl, final boolean sslAcceptAll) {
        this.host = host;
        this.port = port;
        this.useSsl = useSsl;
        this.sslAcceptAll = sslAcceptAll;
    }

    @Override
    public String getHost() {
        return host;
    }

    @Override
    public int getPort() {
        return port;
    }

    @Override
    public boolean getUseSsl() {
        return useSsl;
    }

    @Override
    public boolean getSslAcceptAll() {
        return sslAcceptAll;
    }
}
