/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.support;

import java.net.URI;

import com.vmware.cxfrestclient.CxfClientSecurityContext;
import com.vmware.vcloud.object.extensibility.vcd.ApiConnectionInfo;

/**
 * Default implementation of the {@link ApiConnectionInfo} interface.
 */
public class DefaultApiConnectionInfo implements ApiConnectionInfo {
    private final URI endpoint;
    private final String version;
    private final CxfClientSecurityContext securityContext;

    public DefaultApiConnectionInfo(final URI endpoint, final String version) {
        this.endpoint = endpoint;
        this.version = version;
        this.securityContext = CxfClientSecurityContext.getDefaultCxfClientSecurityContext();
    }

    @Override
    public URI getEndpoint() {
        return endpoint;
    }

    @Override
    public CxfClientSecurityContext getSecurityContext() {
        return securityContext;
    }

    @Override
    public String getVersion() {
        return version;
    }
}
