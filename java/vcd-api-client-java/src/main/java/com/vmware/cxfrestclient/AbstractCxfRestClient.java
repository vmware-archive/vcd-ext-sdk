/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.cxfrestclient;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.List;

import javax.ws.rs.HttpMethod;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBElement;

import com.vmware.cxfrestclient.JaxRsClient.ErrorHandler.Disposition;

import org.apache.cxf.configuration.jsse.TLSClientParameters;
import org.apache.cxf.jaxrs.client.ClientConfiguration;
import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.transport.http.HTTPConduit;

/**
 * Base class for implementations of {@link JaxRsClient} that are based on CXF.
 */
public abstract class AbstractCxfRestClient implements JaxRsClient {

    protected final URI endpoint;
    private ErrorHandler errorHandler;
    private final CxfClientSecurityContext cxfClientSecurityContext;

    protected AbstractCxfRestClient(URI endpoint) {
        this(endpoint, CxfClientSecurityContext.getDefaultCxfClientSecurityContext());
    }

    protected AbstractCxfRestClient(URI endpoint, final CxfClientSecurityContext cxfClientSecurityContext) {
        this.endpoint = endpoint;
        this.cxfClientSecurityContext = cxfClientSecurityContext;
    }

    protected AbstractCxfRestClient(AbstractCxfRestClient client) {
        this(client.endpoint, client.cxfClientSecurityContext);
    }

    protected AbstractCxfRestClient(URI endpoint, AbstractCxfRestClient client) {
        this(endpoint, client.cxfClientSecurityContext);
    }

    /**
     * @return a List of CXF providers for use with CXF proxies and {@link WebClient}s we create.
     */
    protected abstract List<?> getCxfProviders();

    /**
     * A method that must be implemented by derived classes to set any
     * HTTP request headers that the REST API implemented in such derived classes
     * require for proper operation.
     */
    protected abstract void configureHttpRequestHeaders(final org.apache.cxf.jaxrs.client.Client client);

    @Override
    public <JaxRsClass> JaxRsClass createProxy(final Class<JaxRsClass> jaxRsClass) {
        final JaxRsClass proxy = JAXRSClientFactory.create(endpoint.toString(), jaxRsClass, getCxfProviders(), true);
        configureClient(proxy);
        return proxy;
    }

    @Override
    public URI getEndpoint() {
        return endpoint;
    }

    private boolean handleException(URI uri, WebApplicationException e, int failureCount) {
        return
            errorHandler != null &&
            errorHandler.handleError(this, uri, e, failureCount) == Disposition.RETRY;
    }

    @Override
    public Response getResource(URI uri) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri).get();
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public <ResourceClass> ResourceClass getResource(URI uri, Class<ResourceClass> resourceClass) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri).get(resourceClass);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public <ContentsClass> Response putResource(URI uri, String type, JAXBElement<ContentsClass> contents) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri, type).put(contents);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public <ContentsClass> void putResourceVoid(URI uri, String type, JAXBElement<ContentsClass> contents) {
        Response response = putResource(uri, type, contents);
        handleNoContentResponse(response);
    }

    private void handleNoContentResponse(Response response) {
        if (response.getStatus() != HttpURLConnection.HTTP_NO_CONTENT) {
            throw makeException(new WebApplicationException(response));
        }
    }

    @Override
    public <ContentsClass, ResponseClass> ResponseClass putResource(URI uri, String type, JAXBElement<ContentsClass> contents, Class<ResponseClass> responseClass) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri, type).invoke(HttpMethod.PUT, contents, responseClass);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public Response putFile(
            URI uri,
            File file,
            String type) {
        int failureCount = 0;
        do {
            try {
                Response put = createWebClient(uri, type).put(file);
                return put;
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw e;
                }
            }
        } while (true);
    }

    @Override
    public <ContentsClass> Response postResource(URI uri, String type, JAXBElement<ContentsClass> contents) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri, type).post(contents);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public <ContentsClass> void postResourceVoid(URI uri, String type, JAXBElement<ContentsClass> contents) {
        Response response = postResource(uri, type, contents);
        handleNoContentResponse(response);
    }

    @Override
    public <ContentsClass, ResponseClass> ResponseClass postResource(URI uri, String type, JAXBElement<ContentsClass> contents, Class<ResponseClass> responseClass) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri, type).post(contents, responseClass);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public Response deleteResource(URI uri) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri).delete();
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    protected RuntimeException makeException(WebApplicationException exception) {
        throw exception;
    }

    @Override
    public void deleteResourceVoid(URI uri) {
        Response response = deleteResource(uri);
        handleNoContentResponse(response);
    }

    @Override
    public <ResponseClass> ResponseClass deleteResource(URI uri, Class<ResponseClass> responseClass) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri).invoke(HttpMethod.DELETE, null, responseClass);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public Response optionsResource(URI uri) {
        int failureCount = 0;
        do {
            try {
                return createWebClient(uri).invoke(HttpMethod.OPTIONS, null);
            } catch (WebApplicationException e) {
                if (! handleException(uri, e, ++failureCount)) {
                    throw makeException(e);
                }
            }
        } while (true);
    }

    @Override
    public WebClient createWebClient(URI uri) {
        return createWebClient(uri, null);
    }

    @Override
    public WebClient createWebClient(URI uri, String type) {
        WebClient client = WebClient.create(uri.toASCIIString(), getCxfProviders());
        if (type != null) {
            client.type(type);
        }
        configureClient(client);
        return client;
    }

    @Override
    public void setErrorHandler(ErrorHandler errorHandler) {
        this.errorHandler = errorHandler;
    }

    private void configureHttpRequestHeaders(Object proxy) {
        configureHttpRequestHeaders(WebClient.client(proxy));
    }

    /**
     * Set the appropriate ssl context and https hostname verification for this client
     */
    protected final void configureSSLTrustManager(ClientConfiguration config) {
        HTTPConduit httpConduit = (HTTPConduit) config.getConduit();

        final TLSClientParameters tlsParams = new TLSClientParameters();
        tlsParams.setUseHttpsURLConnectionDefaultSslSocketFactory(false);
        tlsParams.setSSLSocketFactory(cxfClientSecurityContext.getSSLSocketFactory());
        if (cxfClientSecurityContext.isHostnameVerificationEnabled()) {
            tlsParams.setUseHttpsURLConnectionDefaultHostnameVerifier(true);
        } else {
            tlsParams.setDisableCNCheck(true);
        }
        httpConduit.setTlsClientParameters(tlsParams);
    }

    private void addHttpChunking(ClientConfiguration config) {
        HTTPConduit httpConduit = (HTTPConduit) config.getConduit();
        httpConduit.getClient().setAllowChunking(true);
    }

    private void adjustConfiguration(ClientConfiguration config) {
        configureSSLTrustManager(config);
        addHttpChunking(config);
    }

    protected void configureClient(Object client) {
        adjustConfiguration(WebClient.getConfig(client));
        configureHttpRequestHeaders(client);
    }
}
