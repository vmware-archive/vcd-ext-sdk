/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.vcloud.api.rest.client;

/**
 * Abstract credentials for use in authenticating REST/HTTP sessions.
 */
public interface ClientCredentials {

    /**
     * Returns the name of the HTTP header used for authentication in a REST request
     */
    String getHeaderName();

    /**
     * Renders client authentication credentials in a form suitable to be used
     * as the value in a header whose name is returned by {@link ClientCredentials#getHeaderName()}
     */
    String getHeaderValue();


    /**
     * Indicates whether the ClientCredentials supports session-less requests.
     * No explicit login is required for session-less ClientCredentials.
     *
     * @return true if ClientCredentials supports session-less requests
     */
    boolean supportsSessionless();
}
