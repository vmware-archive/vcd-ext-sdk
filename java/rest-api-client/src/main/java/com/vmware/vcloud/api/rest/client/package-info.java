/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

/*
 * !!! NOTE !!!
 *
 * Before editing this file in Eclipse, strongly recommend copying it to a simple text editor.
 * When you ask Eclipse to reformat your edited comments, all code samples will lose their
 * pre-formatting and it will be helpful to recover it from your text editor copy.
 */

/**
 * Contains necessary client(s) to facilitate API calls to vCloud Director
 * <P>
 * The starting point for all accesses is the {@link com.vmware.vcloud.api.rest.client.VcdClient}.
 * <P>
 * <B>Vcd Client</B><BR>
 * ==========<BR>
 * The supplied concrete implementation ({@link com.vmware.vcloud.api.rest.client.VcdClientImpl})
 * provides the necessary implementation and is correctly initialized using vCloud Director XML
 * Schemas and can handle the necessary marshalling/un This class serves as a java version of an
 * HTTP request tool (a-la Postman) customized to ensure correct communication with vCloud Director
 * by managing the necessary session, API versioning and other vCloud Director specific state. Once
 * correctly instantiated it allows the user to make the necessary HTTP calls ({@code GET},
 * {@code PUT}, {@code POST} and {@code DELETE} ). The response can be a returned as raw
 * {@link javax.ws.rs.core.Response} object or a parsed {@link javax.xml.bind.JAXBElement} utilizing
 * its familiarity with vCloud Director schema.
 * <P>
 * The client provides further support for interpreting REST navigational links embedded in each
 * response to speedily make subsequent calls and allows exploring the entire data model in a
 * RESTful fashion.
 * <P>
 * <U>Usage examples:</U><BR>
 * TBA
 * <P>
 * <B>Open API Client</B><BR>
 * ===============<BR>
 * An Open API client interacts with vCloud Director's endpoint that serves functionality using the
 * OpenAPI specification. This client supports both {@code JAX-RS} and {@code RESTful} calls to
 * VCD's {@code /cloudapi} endpoints
 * <P>
 * Unlike {@link com.vmware.vcloud.api.rest.client.VcdClientImpl}, which is directly instantiated,
 * an instance of {@link com.vmware.vcloud.api.rest.client.OpenApiClientImpl} can <i>only</i> be
 * acquired from {@link VcdClient#getOpenApiClient()} call. This ensures that both client's share
 * the necessary authentication and other internal state. Once initialized, this client is aware of
 * vCloud Director's OpenAPI compliant API definitions and manages the generation of necessary Java
 * JAX-RS stubs, serialization and de-serialization of JSON model objects and other HTTP compliance.
 * <P>
 * <U>Usage examples:</U> For each of the following examples, {@code ApiModel} represents the data
 * communicated with vCD via {@code ApiInterface} which provides the necessary CRUD methods for the
 * model. {@code ApiInterface} is assumed to be appropriately annotated with necessary JAX-RS
 * annotations.
 * <ol>
 * <li>JAX-RS usage:<BR>
 * Begin by acquiring a CXF Proxy for the the interface and then invoke the necessary API calls as
 * normal java calls. The CXF Proxy will handle the rest of the mechanics to communicate with vCloud
 * Director
 * <ol type="a">
 * <li>Simplest case<BR>
 * This example demonstrates making a Java API call to invoke the corresponding call on vCD.
 *
 * <pre>
 *         final OpenApiClient openApiClient = authenticatedVcdClient.getOpenApiClient();
 *         final ApiInterface api = openApiClient.createProxy(ApiInterface.class);
 *         final ApiModel model = api.getApiModel();
 *
 *         // model.update();
 *
 *         final ApiModel updatedModel = api.putModel(model);
 * </pre>
 *
 * All necessary headers will be configured as per the presence of
 * {@link javax.ws.rs.Produces @Produces}/{@link javax.ws.rs.Consumes @Consumes}</li></li> and other
 * similar JAX-RS headers
 *
 * <li>Configuring Requests<BR>
 * Before making a call, you can acquire a CXF WebClient that will allow you to utilize
 * {@link org.apache.cxf.jaxrs.client.Client} supplied conveniences to override headers as required.
 *
 * <pre>
 *         final OpenApiClient openApiClient = authenticatedVcdClient.getOpenApiClient();
 *         final ApiInterface api = openApiClient.createProxy(ApiInterface.class);
 *
 *         // Get hold of CXF Web
 *         final Client clientForCurrentCall  = openApiClient.getWebClientForNextCall(api);
 *         client.accept("*&sol;*");
 *         final ApiModel model = api.getApiModel();
 * </pre>
 *
 * CXF wire logging confirms that the Accept header used is <code>*&sol;*</code> instead of the
 * value specified in the {@link javax.ws.rs.Consumes @Consumes} annotation for the getter.</li>
 * <li>Accessing Response<BR>
 * {@link javax.ws.rs.core.Response} is also accessed via the CXF
 * {@link org.apache.cxf.jaxrs.client.Client} that must be retrieved <em>before</em> invoking the
 * API call. After the call completes, {@link org.apache.cxf.jaxrs.client.Client#getResponse()} will
 * have the raw {@link javax.ws.rs.core.Response} object that was received by the underlying JAX-RS
 * framework
 *
 * <pre>
 *         final OpenApiClient openApiClient = authenticatedVcdClient.getOpenApiClient();
 *         final ApiInterface api = openApiClient.createProxy(ApiInterface.class);
 *
 *         // Get hold of CXF Web
 *         final Client clientForCurrentCall  = openApiClient.getWebClientForNextCall(api);
 *         final ApiModel model = api.getApiModel();
 *
 *         // Retrieve the response and verify the status code.
 *         final Response response = clientForCurrentCall.getResponse();
 *         System.out.println("Response status code: " + response.getStatus());
 * </pre>
 *
 * </li>
 * <li>Putting together a workflow<BR>
 * Above components can be put together to produce a workflow that resembles a normal
 * <code>Java</code> method than a client implementation
 *
 * <pre>
 *         final OpenApiClient openApiClient = authenticatedVcdClient.getOpenApiClient();
 *         final ApiInterface api = openApiClient.createProxy(ApiInterface.class);
 *
 *         // Get
 *         final ApiModel model = api.getApiModel();
 *
 *         // Invoke a task
 *         final byte[] binaryData = getSomeData();
 *
 *         final Client clientForTask  = openApiClient.getWebClientForNextCall(api);
 *         clientForTask.accept(MediaType.APPLICATION_OCTET_STREAM);
 *         final TaskModel task = api.postAction(model, binaryData);
 *
 *         final Response taskResponse = clientForTask.getResponse();
 *         Assert.assertEquals(response.getStatus(), Response.Status.ACCEPTED);
 *
 *         // Update
 *         model.setXYZ(newXyz);
 *
 *         final ApiModel updatedModel = api.putModel(model);
 *
 *         // And finally delete
 *         final Client clientForDelete  = openApiClient.getWebClientForNextCall(api);
 *
 *         api.deleteModel(updatedModel);      // returns void.
 *
 *         final Response taskResponse = clientForDelete.getResponse();
 *         Assert.assertEquals(response.getStatus(), Response.Status.NO_CONTENT);
 * </pre>
 *
 * As can be seen, the same interface proxy can be used for any number of calls. Underlying client
 * will ensure any Client-based customization is reset between calls.</li>
 * </ol>
 * <li>RESTful usage:
 * <ol type="a">
 * TBA
 * </ol>
 * </li>
 * </ol>
 *
 */

package com.vmware.vcloud.api.rest.client;
