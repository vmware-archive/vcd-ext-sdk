/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.vcloud.api.rest.client;

import javax.ws.rs.core.Response;

import com.vmware.cxfrestclient.JaxRsClient;

import org.apache.cxf.jaxrs.client.Client;

/**
 * REST API client built on OpenAPI framework. Extends {@link JaxRsClient} with behaviors specific
 * to vCloud's Open API.
 * <P>
 * Package {@code com.vmware.vcloud.api.rest.client} Javadoc for detailed description for various
 * usage patterns
 *
 * @see com.vmware.vcloud.api.rest.client
 *
 */
public interface OpenApiClient extends JaxRsClient {

    /**
     * Returns the underlying {@link Client} for next call only.
     * <P>
     * Before invoking the next call, use the returned {@link Client} to manipulate the request.
     * After invocation, use it to access the raw {@link Response} object
     *
     * @param proxy
     *            Proxy of an open API interface acquired from {@link #createProxy(Class)} call
     *
     * @return {@link Client} for the next call invoked.
     */
    <JaxRsClass> Client getWebClientForNextCall(JaxRsClass proxy);
}
