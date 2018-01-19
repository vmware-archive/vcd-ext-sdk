/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.MediaType;

import com.vmware.vcloud.api.rest.client.filters.MultisiteAuthorizationFilter;

import org.apache.cxf.jaxrs.client.Client;

/**
 * A client to interact with VCD's NSX/networking proxy API.
 * <P>
 * An instance of this can only be acquired from {@link VcdClient#getOpenApiClient()} call and this
 * client's authentication is tied to the parent {@link VcdClient} from which this is instantiated
 */
public class NsxProxyApiClient extends AbstractVcdClientBase {

    private final VcdClientImpl parentVcdClient;
    private ClientCredentials clientCredentials;

    /**
     * Creates an instance of NsxProxyApiClient by as dependent on the specified {@link VcdClientImpl}
     * <P>
     * This allows current authentication state to be inherited from the parent
     * {@code VcdClientImpl}
     *
     * @param vcdClient {@link VcdClientImpl} from which this {@link NsxProxyApiClient} has been inherited.
     */
    NsxProxyApiClient(VcdClientImpl vcdClient) {
        super(vcdClient.getOpenApiEndpoint(), vcdClient);
        this.parentVcdClient = vcdClient;
        this.clientCredentials = vcdClient.getCredentials();
    }

    @Override
    protected List<?> getCxfProviders() {
        final List<Object> providers = new ArrayList<>();
        if (clientCredentials instanceof VcdMultisiteLoginCredentials) {
            providers.add(new MultisiteAuthorizationFilter((VcdMultisiteLoginCredentials) clientCredentials));
        }
        providers.add(new XStreamXmlProvider());
        return providers;
    }

    @Override
    protected void setAuthenticationHeaders(Client client) {
        parentVcdClient.setAuthenticationHeaders(client);
    }

    @Override
    protected String[] getAcceptHeaders() {
        return new String[] { MediaType.APPLICATION_XML };
    }
}
