/* **************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.vcloud.api.rest.client;


import java.net.URI;

import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.client.Client;

import com.vmware.cxfrestclient.AbstractCxfRestClient;
import com.vmware.cxfrestclient.CxfClientSecurityContext;
import com.vmware.vcloud.api.rest.client.VcdClient.ClientRequestIdProvider;
import com.vmware.vcloud.api.rest.client.constants.RestConstants;

/**
 * Base class for all clients that can interact with VCD
 * <P>
 * Provides common request header management functionality
 */
abstract class AbstractVcdClientBase extends AbstractCxfRestClient {

    private ClientRequestIdProvider clientRequestIdProvider;

    protected AbstractVcdClientBase(URI endpoint) {
        super(endpoint);
    }

    protected AbstractVcdClientBase(URI endpoint, CxfClientSecurityContext cxfClientSecurityContext) {
        super(endpoint, cxfClientSecurityContext);
    }

    protected AbstractVcdClientBase(AbstractCxfRestClient client) {
        super(client);
    }

    /**
     * Configure authentication headers on the supplied clients
     * <P>
     * May possibly set cookies too, if applicable.
     *
     * @param client
     *            {@link Client} to set authentication headers on.
     */
    protected abstract void setAuthenticationHeaders(final org.apache.cxf.jaxrs.client.Client client);

    /**
     * Accept headers that must be included with the request.
     *
     * @return Appropriately formatted accept values in String format.
     */
    protected abstract String[] getAcceptHeaders();

    /**
     * Get the value to be sent in the X-VMWARE-VCLOUD-ORG-ID header
     */
    protected String getOrgContextHeader() {
        return null;
    }

    public AbstractVcdClientBase(URI endpoint, AbstractCxfRestClient client) {
        super(endpoint, client);
    }

    protected ClientRequestIdProvider getClientRequestIdProvider() {
        return clientRequestIdProvider;
    }

    @Override
    protected final void configureHttpRequestHeaders(final org.apache.cxf.jaxrs.client.Client client) {
        client.accept(getAcceptHeaders());

        setAuthenticationHeaders(client);

        if (clientRequestIdProvider != null) {
            final String clientRequestId = clientRequestIdProvider.getClientRequestId();
            if (!StringUtils.isEmpty(clientRequestId)) {
                client.header(RestConstants.VCLOUD_CLIENT_REQUEST_ID_HEADER, clientRequestId);
            }
        }

        if (getOrgContextHeader() != null) {
            client.header(RestConstants.VCLOUD_ORG_CONTEXT_HEADER, getOrgContextHeader());
        }
    }

    protected void setClientRequestIdProvider(ClientRequestIdProvider clientRequestIdGenerator) {
        this.clientRequestIdProvider = clientRequestIdGenerator;
    }
}
