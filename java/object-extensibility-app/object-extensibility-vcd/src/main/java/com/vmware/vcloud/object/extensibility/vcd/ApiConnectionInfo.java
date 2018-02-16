/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd;

import java.net.URI;

import com.vmware.cxfrestclient.CxfClientSecurityContext;

/**
 * Interface that defines the properties that are needed to connect to the vCloud
 * Director API.
 */
public interface ApiConnectionInfo {
    /**
     * Gets the {@link URI} endpoint of the vCloud Director API.
     *
     * @return a {@link URI} endpoint
     */
    URI getEndpoint();

    /**
     * Gets the security context to use for communicating with the vCloud Director
     * API via HTTPS.
     *
     * @return a security context instance
     */
    CxfClientSecurityContext getSecurityContext();

    /**
     * Gets the version of the vCloud Director API preferred by the API client.
     *
     * @return an API version string
     */
    String getVersion();
}
