/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import com.vmware.cxfrestclient.JaxRsClient;

import org.apache.cxf.jaxrs.client.Client;
import org.apache.cxf.jaxrs.client.WebClient;

/**
 * An Open API client for VCD that allows both JAX-RS and RESTful calls to VCD's /cloudapi endpoints
 * <P>
 * An instance of this can only be acquired from {@link VcdClient#getOpenApiClient()} call and this
 * client's authentication is tied to the parent {@link VcdClient} from which this is instantiated
 */
class OpenApiClientImpl extends AbstractVcdClientBase implements OpenApiClient {
    private final VcdClientImpl parentVcdClient;

    /**
     * Creates an instance of OpenApiClient by as dependent on the specified {@link VcdClientImpl}
     * <P>
     * This allows current authentication state to be inherited from the parent
     * {@code VcdClientImpl}
     *
     * @param vcdClient
     *            {@link VcdClientImpl} from which this {@link OpenApiClientImpl} has been
     *            inherited.
     */
    OpenApiClientImpl(VcdClientImpl vcdClient) {
        super(vcdClient.getOpenApiEndpoint(), vcdClient);
        this.parentVcdClient = vcdClient;
    }

    @Override
    protected List<?> getCxfProviders() {
        final ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(Include.NON_NULL);
        final JacksonJsonProvider provider = new JacksonJsonProvider(mapper);
        return Collections.singletonList(provider);
    }

    @Override
    protected void setAuthenticationHeaders(Client client) {
        parentVcdClient.setAuthenticationHeaders(client);
    }

    @Override
    protected String[] getAcceptHeaders() {
        return new String[] { MediaType.APPLICATION_JSON };
    }

    /**
     * Return a custom proxy that ensures that a new proxy object is generated for each call.
     * <P>
     * This ensures that when underlying {@link Client} is utilized for a particular call, custom
     * settings for that call are reset before the next call. {@link JaxRsClient#createProxy(Class)
     * super.createProxy(Class)} is invoked to create proxy objects as needed.
     * <P>
     *
     * @param jaxrsApiInterface
     *            {@link Class} for a open api generated interface
     *
     * @return a {@link Proxy} for the specified interface as described above.
     */
    @Override
    public <JaxRsClass> JaxRsClass createProxy(Class<JaxRsClass> jaxrsApiInterface) {
        if (!jaxrsApiInterface.isInterface()) {
            throw new IllegalArgumentException(String.format("Class %s to proxy must be an interface",
                    jaxrsApiInterface.getName()));
        }
        @SuppressWarnings("unchecked")
        final JaxRsClass proxiedProxy =
            (JaxRsClass) Proxy.newProxyInstance(jaxrsApiInterface.getClassLoader(), new Class[] { jaxrsApiInterface },
                    new SingleUseProxyInvoker<>(jaxrsApiInterface, this));
        return proxiedProxy;
    }

    @Override
    public <JaxRsProxy> Client getWebClientForNextCall(JaxRsProxy proxy) {
        @SuppressWarnings("unchecked")
        final SingleUseProxyInvoker<JaxRsProxy> invocationHandler =
                (SingleUseProxyInvoker<JaxRsProxy>) Proxy.getInvocationHandler(proxy);
        return invocationHandler.getNextCallClient();
    }

    private static final class SingleUseProxyInvoker<JaxRsApi> extends AbstractVcdClientBase
    implements InvocationHandler {
        private final OpenApiClientImpl parentClient;
        private final Class<JaxRsApi> api;
        private final AtomicReference<JaxRsApi> apiProxy = new AtomicReference<>(null);

        SingleUseProxyInvoker(Class<JaxRsApi> api, OpenApiClientImpl parentClient) {
            super(parentClient);
            this.parentClient = parentClient;
            this.api = api;
            resetWebClientProxy();
        }

        private void resetWebClientProxy() {
            apiProxy.set(null);
        }

        private JaxRsApi getCurrentClientProxy() {
            apiProxy.compareAndSet(null, createProxy(api));
            return apiProxy.get();
        }

        Client getNextCallClient() {
            return WebClient.client(getCurrentClientProxy());
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            try {
                return method.invoke(getCurrentClientProxy(), args);
            } catch (InvocationTargetException ite) {
                throw ite.getCause();
            } finally {
                resetWebClientProxy();
            }
        }

        @Override
        protected void setAuthenticationHeaders(Client client) {
            parentClient.setAuthenticationHeaders(client);
        }

        /**
         * Return an empty array of {@code Accept} header values.
         * <P>
         * This will let the proxy configure the {@code Accept} based on {@link Consumes} annotation on
         * the method invoked.
         *
         * @return An empty array
         */
        @Override
        protected String[] getAcceptHeaders() {
            return new String[0];
        }

        @Override
        protected List<?> getCxfProviders() {
            return parentClient.getCxfProviders();
        }
    }
}
