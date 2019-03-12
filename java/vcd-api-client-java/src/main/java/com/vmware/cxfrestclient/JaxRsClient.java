/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.cxfrestclient;

import java.io.File;
import java.net.URI;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBElement;

import org.apache.cxf.jaxrs.client.WebClient;

/**
 * A REST API client. Allows simple, type-safe access to standard HTTP methods. Each HTTP method has
 * two corresponding methods in this interface: one that returns an application-specific response
 * object of a JAXB-generated class (representing the body of the response to the HTTP method
 * request), and one that returns a generic JAX-RS {@link Response} object. The latter is primarily
 * for use by callers that need the response's metadata (perhaps in addition to it body). It can
 * also be used in cases where the response has no body, although an equivalent approach is to
 * specify {@link Void} as the "ResponseClass" generic parameter and {@link Void}.class as the
 * "requestType" method parameter.
 * <p>
 * Users of this interface can use {@link JaxRsClient#setErrorHandler(ErrorHandler)} to set an
 * {@link ErrorHandler} to control whether retries happen or not when HTTP request fail. (If there's
 * no handler, no retry is attempted).
 * <p>
 * Largely a wrapper around Apache CXF {@link WebClient}.
 */
public interface JaxRsClient {

    public static final JAXBElement<?> EMPTY_CONTENTS = null;

    /**
     * Gets a proxy for the specified service.
     * @param <JaxRsClass> the JAXRS-annotated class
     * @param jaxRsClass the JAXRS-annotated class
     * @return a service proxy
     */
    <JaxRsClass> JaxRsClass createProxy(Class<JaxRsClass> jaxRsClass);

    /**
     * Retrieves the endpoint used to create this client
     * @return {@link URI} of the endpoint this client talks to
     */
    URI getEndpoint();

    /**
     * Gets the specified contents to the specified resource.  (Does an HTTP GET.)
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param ref reference to the resource
     * @return response from the get request
     */
    <ContentsClass> Response getResource(URI ref);

    /**
     * Gets the contents of the specified resource.  (Does an HTTP GET.)
     * @param <ResourceClass> JAXB-generated class of the resource
     * @param ref reference to the resource
     * @param resourceClass JAXB-generated class of the resource
     * @return the contents of the resource
     */
    <ResourceClass> ResourceClass getResource(URI ref, Class<ResourceClass> resourceClass);

    /**
     * Puts the specified contents to the specified resource.  (Does an HTTP PUT.)
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param ref reference to the resource
     * @param mediaType media type of content
     * @param contents contents to be put
     * @return response from the put request
     */
    <ContentsClass> Response putResource(URI ref, String mediaType, JAXBElement<ContentsClass> contents);

    /**
     * Puts the specified contents to the specified resource.  (Does an HTTP PUT.)
     * And expects a HTTP 204 response status.
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param ref reference to the resource
     * @param mediaType media type of content
     * @param contents contents to be put
     */
    <ContentsClass> void putResourceVoid(URI ref, String mediaType, JAXBElement<ContentsClass> contents);

    /**
     * Puts the specified contents to the specified resource.  (Does an HTTP PUT.)
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param <ResponseClass> JAXB-generated class of the response
     * @param ref reference to the resource
     * @param mediaType media type of content
     * @param contents contents to be put
     * @param responseClass JAXB-generated class of the response
     * @return response from the put request
     */
    <ContentsClass, ResponseClass> ResponseClass putResource(URI ref, String mediaType, JAXBElement<ContentsClass> contents, Class<ResponseClass> responseClass);


    /**
     * Puts the contents of the specified <code>file</code> to the specified <code>uri</code>.  (Does an HTTP PUT.)
     * @param uri HTTP PUT target {@link URI}
     * @param file {@link File} to upload
     * @param mediaType media type of content
     * @return response from the put request
     */
    Response putFile(URI uri, File file, String mediaType);

    /**
     * Posts the specified contents to the specified resource.  (Does an HTTP POST.)
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param ref reference to the resource
     * @param mediaType media type of content
     * @param contents contents to be post
     * @return response from the the post request
     */
    <ContentsClass> Response postResource(URI ref, String mediaType, JAXBElement<ContentsClass> contents);

    /**
     * Posts the specified contents to the specified resource.  (Does an HTTP POST.)
     * And expects a HTTP 204 response status.
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param ref reference to the resource
     * @param mediaType media type of content
     * @param contents contents to be post
     * @return response from the the post request
     */
    <ContentsClass> void postResourceVoid(URI ref, String mediaType, JAXBElement<ContentsClass> contents);

    /**
     * Posts the specified contents to the specified resource.  (Does an HTTP POST.)
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param <ResponseClass> JAXB-generated class of the response
     * @param ref reference to the resource
     * @param mediaType media type of content
     * @param contents contents to be post
     * @param responseClass JAXB-generated class of the response
     * @return response from the post request
     */
    <ContentsClass, ResponseClass> ResponseClass postResource(URI ref, String mediaType, JAXBElement<ContentsClass> contents, Class<ResponseClass> responseClass);

    /**
     * Deletes the specified resource.  (Does an HTTP DELETE.)
     * @param ref reference to the resource
     * @return response from the delete request
     */
    Response deleteResource(URI ref);

    /**
     * Deletes the specified resource and expects a HTTP 204 response status. (Does an HTTP DELETE.)
     * @param ref reference to the resource
     */
    void deleteResourceVoid(URI ref);

    /**
     * Deletes the specified contents to the specified resource.  (Does an HTTP DELETE.)
     * @param <ResponseClass> JAXB-generated class of the response
     * @param ref reference to the resource
     * @param responseClass JAXB-generated class of the response
     * @return response from the delete request
     */
    <ResponseClass> ResponseClass deleteResource(URI ref, Class<ResponseClass> responseClass);

    /**
     * Gets OPTIONS response of the specified resource.
     * @param ref reference to the resource
     * @return response from the options request
     */
    Response optionsResource(URI ref);

    /**
     * Sets the handler to be called when requests made with this client fail.
     */
    void setErrorHandler(ErrorHandler errorHandler);

    /**
     * The interface used when requests fail.
     */
    interface ErrorHandler {
        enum Disposition {RETRY, FAIL};

        /**
         * Returns an indication of whether a request made to the specified URI which failed with
         * the specified exception should be retried or failed. Implementations of this method that
         * return RETRY are assumed to have modified the client in a way that is likely to
         * result in success on a retry (e.g., by arranging that request headers will be different
         * on the retried request).
         * @param client the client on which the failing request was made
         * @param ref the URI used in the failing request
         * @param e the exception raised when the request was made
         * @param failureCount the number of times the request has failed (always >= 1)
         */
        Disposition handleError(JaxRsClient client, URI ref, WebApplicationException e, int failureCount);
    }

    /**
     * Returns a CXF {@link WebClient} corresponding to the specified URI.  Requests on the
     * resulting WebClient will have their "Content-Type" header set to the specified media type.
     */
    WebClient createWebClient(URI uri, String mediaType);

    /**
     * Returns a CXF {@link WebClient} corresponding to the specified URI.
     */
    WebClient createWebClient(URI uri);
}
