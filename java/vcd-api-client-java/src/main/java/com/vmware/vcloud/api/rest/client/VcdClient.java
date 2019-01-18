/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.stream.Stream;

import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBElement;

import org.apache.cxf.jaxrs.client.Client;
import org.apache.cxf.jaxrs.ext.search.SearchUtils;
import org.apache.cxf.jaxrs.ext.search.client.SearchConditionBuilder;

import com.vmware.cxfrestclient.CxfClientSecurityContext;
import com.vmware.cxfrestclient.JaxRsClient;
import com.vmware.vcloud.api.rest.client.constants.RelationType;
import com.vmware.vcloud.api.rest.schema.versioning.SupportedVersionsType;
import com.vmware.vcloud.api.rest.schema_v1_5.AdminOrgType;
import com.vmware.vcloud.api.rest.schema_v1_5.ApiExtensibilityType;
import com.vmware.vcloud.api.rest.schema_v1_5.EntityType;
import com.vmware.vcloud.api.rest.schema_v1_5.MultisiteSessionUserInfoType;
import com.vmware.vcloud.api.rest.schema_v1_5.OrgType;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryListType;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultRecordType;
import com.vmware.vcloud.api.rest.schema_v1_5.ReferenceType;
import com.vmware.vcloud.api.rest.schema_v1_5.ResourceType;
import com.vmware.vcloud.api.rest.schema_v1_5.SessionType;
import com.vmware.vcloud.api.rest.schema_v1_5.VCloudType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.VMWExtensionType;

/**
 * A vCloud REST API client.  Extends {@link JaxRsClient} with behaviors specific to the vCloud REST API.
 */
public interface VcdClient extends JaxRsClient {

    /**
     * A callback contract to inform the caller that
     * a href value has been repaired.
     */
    public interface ReferenceTypeChangedCallBack {
        /**
         * Invoked when an href is automatically repaired.
         *
         * @param changedHref the string value representing the repaired href
         */
        void hrefChanged(String changedHref);
    }

    /**
     * Returns client request ID to use when making request to VCD.
     * <p>
     * The client request ID is never cached and is fetched anew for each request to VCD.
     */
    public interface ClientRequestIdProvider {

        /**
         * @return client request ID to specify in request to VCD
         */
        String getClientRequestId();
    }

    /**
     * An token that can be retrieved from one {@link VcdClient} to attach another {@link VcdClient}
     * to the same session.
     */
    public interface SessionToken {

        /**
         * @return session token {@link String} returned during login response
         */
        String getAuthenticationToken();
    }

    /**
     * Gets information about the vCloud API versions supported by the server.
     */
    SupportedVersionsType getVersions();

    /**
     * Gets the API version used by the client for vCloud API requests
     */
    String getClientApiVersion();

    /**
     * Logs in to the remote vCloud API end point using the supplied credentials.
     * @deprececated use {@link VcdClient#setCredentials(ClientCredentials)}
     */
    @Deprecated
    void login(ClientCredentials credentials);

    /**
     * Repeats login if client credentials are present. Throws a runtime exception if they are null.
     */
    void relogin();

    /**
     * Sets the credentials used for authentication.
     * If the credentials are not session-less, a login is immediately performed.
     */
    void setCredentials(ClientCredentials credentials);

    /**
     * Reuses an existing session on the remote vCloud API end point using the supplied session
     * token taken from another {@code VcdClient}.
     *
     * @param sessionToken
     *            An opaque token which represents an existing session from a {@code VcdClient}
     */
    void loginWithToken(SessionToken sessionToken);

    /**
     * Reuses an existing session on the remote vCloud API end point using the supplied JWT taken
     * from another {@code VcdClient}.
     *
     * @param jwt
     *            A JWT which represents an existing session from a {@code VcdClient}
     * @param orgIdSecurityContext
     *            orgId of the org security context to make the request in. Used for Multisite
     *            requests. Pass null to use issuing org as the context.
     */
    void loginWithJwt(String jwt, String orgIdSecurityContext);

    /**
     * Logs out of the remote vCloud API end point
     */
    void logout();

    /**
     * Creates a clone of current {@link VcdClient}
     *
     * The new client will communicate with the same vCD as this client and is initialized with same
     * credentials and {@link CxfClientSecurityContext}. The session may or may not be shared amond
     * the 2 sessions.
     *
     * @param newSession
     *            <code>true</code> if a new session should be created in the cloned client,
     *            <code>false</code> if both clients must share the session
     * @return a new {@link VcdClient}
     * @throws VcdErrorException
     *             if there were errors while initializing the cloned client
     */
    VcdClient duplicate(boolean newSession) throws VcdErrorException;

    /**
     * @param clientRequestIdProvider
     *            {@link ClientRequestIdProvider} to use to populate client request ID in requests
     *            to VCD
     */
    void setClientRequestIdProvider(ClientRequestIdProvider clientRequestIdProvider);

    /**
     * Get the current opaque session token for this client. This can be used to attach a new
     * {@code VcdClient} to an existing logged in session.
     *
     * @return The current session token for this client. {@code null} if there is none.
     */
    SessionToken getSessionToken();

    /**
     * Get the current JWT for this client. This can be used to attach a new {@code VcdClient} to an
     * existing logged in session and for making a request to a different, associated, org.
     *
     * @return The current JWT for this client. {@code null} if there is none.
     */
    String getJwtToken();

    /**
     * Retrieves the current server status from the {@code api/server_status} endpoint, adjusting
     * the {@code Accept} headers as needed.
     *
     * @return {@link Response} object containing response and http status code returned by the
     *         call.
     */
    Response getServerStatus();

    /**
     * Convenience wrapper over {@link JaxRsClient#getResource(java.net.URI, Class)}.
     */
    <ResourceClass> ResourceClass getResource(ReferenceType ref, Class<ResourceClass> resourceClass);

    /**
     * Get an entity using a {@link ReferenceType} by first trying with its href and, when it fails,
     * trying to recover using the vcd entity resolver service.
     *
     * <p>This method tolerates a {@link ReferenceType} instance where {@link ReferenceType#getHref()}
     * might return null or an invalid href. When the href is invalid or null, an attempt is made at
     * resolving a new href in order to GET the entity. This attempt is made possible by using the
     * API endpoint associated to this {@link VcdClient} and the entity identifier set in the passed
     * {@link ReferenceType}. The assumption is that the user of this API may persists the href of entities for
     * some period of time, while the vCloud API endpoint may be changed independently later on.
     * When an attempt to recover the entity href is successful, the
     * passed {@link ReferenceTypeChangedCallBack} is invoked with the new href as a parameter.
     *
     * <p>In the context of this method, an invalid href is defined has a URL on which an HTTP GET
     * fails, this happens when for example a href is:
     * <ul>
     * <li>a null reference (the initial GET can be skipped in that case)
     * <li>or the host is not reachable,
     * <li>or the VCD server process on the host is unresponsive,
     * <li>or the path in the href is no longer supported by the VCD server process.
     * </ul>
     *
     * @param referenceType a {@link ReferenceType} of the entity to get
     * @param resourceClass a specialized {@link EntityType} class
     * @param referenceTypeChangedCallBack a {@link ReferenceTypeChangedCallBack}
     * @return a {@link EntityType} corresponding to the given {@link ReferenceType}
     */
    <T extends EntityType> T getEntity(
            ReferenceType referenceType,
            Class<T> resourceClass,
            ReferenceTypeChangedCallBack referenceTypeChangedCallBack);

    /**
     * Gets the contents of the resource referenced by its href
     * @param <ResourceClass> JAXB-generated class of the linked-to resource
     * @param resource the resource with the link
     * @param resourceClass JAXB-generated class of the linked-to resource
     * @return the contents of the linked-to resource
     */
    <ResourceClass extends ResourceType> ResourceClass getResource(ResourceType resource, Class<ResourceClass> resourceClass);

    /**
     * Gets the contents of the resource referenced by the link with the specified rel
     * and mediaType in the specified resource.
     * @param <ResourceClass> JAXB-generated class of the linked-to resource
     * @param resource the resource with the link
     * @param rel the rel of the desired link
     * @param mediaType media type of content
     * @param resourceClass JAXB-generated class of the linked-to resource
     * @return the contents of the linked-to resource
     */
    <ResourceClass> ResourceClass getResource(ResourceType resource, RelationType rel,
            String mediaType, Class<ResourceClass> resourceClass);

    /**
     * Convenience wrapper over {@link JaxRsClient#putResource(java.net.URI, String, JAXBElement, Class)
     */
    <ContentsClass, ResponseClass> ResponseClass putResource(ReferenceType reference,
            String mediaType, JAXBElement<ContentsClass> contents, Class<ResponseClass> responseClass);

    /**
     * Like {@link VcdClient#putResource(ReferenceType, String, JAXBElement, Class)} except constrains
     * the type of the contents parameter to be a type that has an href field and assumes that field
     * has been populated (which, for example, it will naturally if was returned by a getResource call and then
     * modified for use in this call).
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param <ResponseClass> JAXB-generated class of the response
     * @param mediaType media type of the content
     * @param contents the contents to put; contents.getHref() must be valid and identify the resource to be modified
     * @param responseClass JAXB-generated class of the response
     * @return response from the put request
     */
    <ContentsClass extends ResourceType, ResponseClass> ResponseClass putResource(String mediaType,
            JAXBElement<ContentsClass> contents, Class<ResponseClass> responseClass);

    /**
     * Puts the contents to the resource referenced by the link with the specified rel and
     * mediaType in the specified resource
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param <ResponseClass> JAXB-generated class of the response
     * @param resource the resource with the link
     * @param rel the rel of the desired link
     * @param mediaType media type of content
     * @param contents the contents to be put
     * @param responseClass JAXB-generated class of the response
     * @throws VcdErrorException put request completes with error.
     * @return response from the put request
     */
    <ContentsClass, ResponseClass> ResponseClass putResource(ResourceType resource,
            RelationType rel, String mediaType, JAXBElement<ContentsClass> contents,
            Class<ResponseClass> responseClass) throws VcdErrorException;

    /**
     * Convenience wrapper over {@link JaxRsClient#postResource(java.net.URI, String, JAXBElement, Class)}
     */
    <ContentsClass, ResponseClass> ResponseClass postResource(ReferenceType reference,
            String mediaType, JAXBElement<ContentsClass> contents,
            Class<ResponseClass> responseClass);

    /**
     * Posts the contents to the resource referenced by the link with the specified rel and
     * mediaType in the specified resource
     * @param <ContentsClass> JAXB-generated class of the request contents
     * @param <ResponseClass> JAXB-generated class of the response
     * @param resource the resource with the link
     * @param rel the rel of the desired link
     * @param mediaType media type of content
     * @param contents the contents to be post
     * @param responseClass JAXB-generated class of the response
     * @throws VcdErrorException post request completes with error.
     * @return response from the post request
     */
    <ContentsClass, ResponseClass> ResponseClass postResource(ResourceType resource,
            RelationType rel, String mediaType, JAXBElement<ContentsClass> contents,
            Class<ResponseClass> responseClass) throws VcdErrorException;

    /**
     * Convenience wrapper over {@link JaxRsClient#deleteResource(java.net.URI, Class).
     */
    <ResponseClass> ResponseClass deleteResource(ReferenceType ref, Class<ResponseClass> responseClass);

    /**
     * Convenience wrapper over {@link JaxRsClient#deleteResource(java.net.URI, Class).
     * @param ref
     * @param responseClass
     */
    <ResponseClass> ResponseClass deleteResource(ResourceType ref,
                                                    Class<ResponseClass> responseClass);

    /**
     * Deletes the resource described by the specified resource type.  The target for
     * the HTTP DELETE request is determined by looking for a "remove" link ({@link RelationType.REMOVE})
     * in the specified resource type (whose associated URL might or might not be the same as the value of
     * the resource type's "href" field).
     *
     * @throws VcdErrorException delete request completes with error.
     */
    Response removeResource(ResourceType resource) throws VcdErrorException;

    /**
     * Convenience wrapper over {@link JaxRsClient#deleteResource(java.net.URI, Class).
     * @param ref
     * @param force
     *            forces the resource to be deleted without regard to its state; child objects will
     *            not be removed unless {@code recursive} delete is also asserted; {@code null}
     *            indicates that this parameter will be omitted
     * @param recursive
     *            recursively removes this resource and its children; {@code null} indicates that
     *            this parameter will be omitted
     * @param responseClass
     */
    <ResponseClass> ResponseClass deleteResource(ReferenceType ref,
                                                    Boolean force,
                                                    Boolean recursive,
                                                    Class<ResponseClass> responseClass);

    /**
     * Deletes the resource described by the specified resource type.  The target for
     * the HTTP DELETE request is the "href" of the {@code ResourceType} itself.
     * @param resource
     * @param force
     *            forces the resource to be deleted without regard to its state; child objects will
     *            not be removed unless {@code recursive} delete is also asserted; {@code null}
     *            indicates that this parameter will be omitted
     * @param recursive
     *            recursively removes this resource and its children; {@code null} indicates that
     *            this parameter will be omitted
     * @param responseClass
     */
    <ResponseClass> ResponseClass deleteResource(ResourceType resource,
                                                    Boolean force,
                                                    Boolean recursive,
                                                    Class<ResponseClass> responseClass);
    /**
     * Deletes the resource described by the specified resource type.  The target for
     * the HTTP DELETE request is determined by looking for a "remove" link ({@link RelationType.REMOVE})
     * in the specified resource type (whose associated URL might or might not be the same as the value of
     * the resource type's "href" field).
     * @param resource
     * @param force
     *            forces the resource to be deleted without regard to its state; child objects will
     *            not be removed unless {@code recursive} delete is also asserted; {@code null}
     *            indicates that this parameter will be omitted
     * @param recursive
     *            recursively removes this resource and its children; {@code null} indicates that
     *            this parameter will be omitted
     * @param responseClass
     */
    <ResponseClass> ResponseClass removeResource(ResourceType resource,
                                                    Boolean force,
                                                    Boolean recursive,
                                                    Class<ResponseClass> responseClass);

    /**
     * Gets the organizations defined/accessible in the vCloud server.  {@link VCloudClient#login}
     * must be called prior to calling this method.
     * @return list of organizations
     * @throws IllegalStateException if called when not logged in
     */
    List<ReferenceType> getOrganizations();

    /**
     * Returns info about the org the session is logged in as.
     * @throws IllegalStateException if called when not logged in
     */
    OrgType getLoggedInOrg();

    /**
     * Returns info about the admin view of the org, the session is logged in as (if permitted).
     * @throws MissingLinkException if link is unavailable because the user may not have access to it.
     */
    AdminOrgType getLoggedInAdminOrg();

    /**
     * Returns the {@link SessionType} for the current session
     * @throws IllegalStateException if called when not logged in
     */
    SessionType getSession();

    /**
     * Returns the {@link MultisiteSessionUserInfoType} for the current session's user
     *
     * @throws IllegalStateException
     *             if called when not logged in
     */
    MultisiteSessionUserInfoType getSessionUserInfo();

    /**
     * Returns the "admin" root resource type.
     * @throws IllegalStateException if called when not logged in
     */
    VCloudType getAdmin();

    /**
     * Returns an OpenApiClient (which continues to use the existing session).
     */
    OpenApiClient getOpenApiClient();

    /**
     * Returns an NsxProxyApiClient (which continues to use the existing session).
     */
    NsxProxyApiClient getNsxProxyApiClient();

    /**
     * Returns the "extension" root resource type.
     * @throws IllegalStateException if called when not logged in
     */
    VMWExtensionType getExtension();

    /**
     * Returns the list of supported queries.
     * @throws IllegalStateException if called when not logged in
     */
    QueryListType getQueryList();

    /**
     * Returns the Api Extensibility object
     * @throws IllegalStateException if called when not logged in
     */
    ApiExtensibilityType getApiExtensibility();

    /**
     * Returns information about the resource with the specified ID.
     * <p>The class of the returned value corresponds to the media-type 'application/vnd.vmware.vcloud.entity',
     * this means it's a strict instance of {link EntityType}, and not a specialization of {@link EntityType}.
     * <p>Note that to fetch an entity and cast it to its specialized JAXB binding the methods
     * {@link #getEntity(ReferenceType, Class)} and {@link #getEntity(ReferenceType, Class, ReferenceTypeChangedCallBack)}
     * are available.
     *
     * @param id the unique identifier of the entity to resolve
     * @return an instance of {@link EntityType}
     * @throws IllegalStateException if called when not logged in
     * @see #getEntity(ReferenceType, Class)
     * @see #getEntity(ReferenceType, Class, ReferenceTypeChangedCallBack)
     */
    EntityType resolveEntityById(String id);

    /**
     * Resolve a vCloud entity using its identifier and then fetch the corresponding vCloud entity instance.
     *
     * @param entityId the vCloud entity identifier to use to resolve the entity
     * @param mediaType the media type corresponding to this entity
     * @param responseClass the JAXB generated binding corresponding to the returned result
     * @return a {@link EntityType} instance cast to its specific JAXB binding
     * @see #resolveEntityById(String)
     * @see #getEntity(ReferenceType, Class, ReferenceTypeChangedCallBack)
     */
    <ResponseClass extends EntityType> ResponseClass getEntity(String entityId, String mediaType,
            Class<ResponseClass> responseClass);

    /**
     * Returns an object factory for vCD API schema classes.
     */
    com.vmware.vcloud.api.rest.schema_v1_5.ObjectFactory getVCloudObjectFactory();

    /**
     * Returns an object factory for vCD Extension API schema classes.
     */
    com.vmware.vcloud.api.rest.schema_v1_5.extension.ObjectFactory getVCloudExtensionObjectFactory();

    /**
     * Returns an object factory for OVF schema classes.
     */
    com.vmware.vcloud.api.rest.schema.ovf.ObjectFactory getOvfObjectFactory();

    /**
     * Returns an object factory VMware-specific OVF schema classes.
     */
    com.vmware.vcloud.api.rest.schema.ovf.vmware.ObjectFactory getOvfVmwareObjectFactory();

    /**
     * Returns task monitor, which can be used to monitor specific task returned by POST or PUT
     * requests.
     */
    VcdTaskMonitor getTaskMonitor();

    /**
     * @return an instance of {@link EventViewer}.
     */
    EventViewer getEventViewer();

    /**
     * Controls whether requests made with this client request federated behavior or not.
     * @param federateRequests
     */
    void setMultisiteRequests(boolean federateRequests);

    /**
     * Sets the vCloud API authentication header in the specified JAX-RS {@link Client} object
     * to be the one for this {@link VcdClient}.
     * @throws IllegalStateException if called when not logged in
     */
    void setAuthenticationHeader(Client client);

    /**
     * Sets the X-VMWARE-VCLOUD-ORG-ID header to the specified value
     */
    void setOrgContextHeader(String orgContext);

    /**
     * Represents a query which can be executed against VCD.
     *
     * @param <QueryResultClass>
     *            Type of individual query result. Must be {@link ReferenceType} or a type derived
     *            from {@link QueryResultRecordType}.
     */
    public interface Query<QueryResultClass> {
        public final int DEFAULT_MAX_PAGE_SIZE = 128;

        /**
         * Sets query result format.
         * <p>
         * By default, query result format is set to {@link QueryResultFormat#RECORDS} if
         * {@code QueryResultClass} is derived from {@link QueryResultRecordType} and
         * {@link QueryResultFormat#REFERENCES} if {@code QueryResultClass} is {@link ReferenceType}.
         * <p>
         * When {@code QueryResultClass} is derived from {@link QueryResultRecordType} this method
         * can be used to override result format with {@link QueryResultFormat#ID_RECORDS}.
         *
         * @param queryResultFormat
         *            Desired query result format
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setQueryResultFormat(QueryResultFormat queryResultFormat);

        /**
         * Sets page number to retrieve.
         * <p>
         * By default query execution retrieves first page.
         *
         * @param page
         *            page number; must be >= 1
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setPage(int page);

        /**
         * Sets page size.
         * <p>
         * By default, page size configured in VCD is used.
         *
         * @param pageSize
         *            number of records per page; must be >= 1
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setPageSize(int pageSize);

        /**
         * Sets query filter.
         * <p>
         * This expects specified filter to be URL encoded. Call to this method will replace an
         * existing filter.
         *
         * @param filter
         *            query filter
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setFilter(String filter);

        /**
         * Sets query fields.
         * <p>
         * Comma-separated list of attribute names or metadata key names to return.
         *
         * @param fields
         *            query fields
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setFields(Collection<String> fields);

        /**
         * Return a {@link SearchConditionBuilder} - Apache CXF's FIQL Query builder configured for
         * use as per URL query format requirements
         *
         * @return an instance of {@link SearchConditionBuilder} FIQL query builder
         */
        static SearchConditionBuilder getFilterBuilder() {
            final Map<String, String> fiqlBuilderProperties = new HashMap<>();
            // specify date format for query string
            fiqlBuilderProperties.put(SearchUtils.DATE_FORMAT_PROPERTY, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
            // Ensure that timezone string contains a ':' per XML date format (-05:00 instead of -0500)
            fiqlBuilderProperties.put(SearchUtils.TIMEZONE_SUPPORT_PROPERTY, Boolean.TRUE.toString());

            return SearchConditionBuilder.instance(fiqlBuilderProperties);
        }

        /**
         * Sets equality filter to query that the specified attribute name has the specified value.
         * Eg, attributeName==attributeValue
         * <p>
         * This URL encodes the specified attribute value. Call to this method will append the
         * specified filter to an existing query filter.
         *
         * @param attributeName
         *            name of the attribute whose value is to be queries.
         * @param attributeValue
         *            value of the attribute being queried.
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setEqualityFilter(String attributeName, String attributeValue);

        /**
         * Sets descending sort order by specified field.
         *
         * @param fieldName field to sort by
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setSortDesc(String fieldName);

        /**
         * Sets ascending sort order by specified field.
         *
         * @param fieldName field to sort by
         * @return {@code this} instance to enable chaining of method invocations
         */
        Query<QueryResultClass> setSortAsc(String fieldName);

        /**
         * Sets flag for including links in query results.
         *
         * @param includeLinks
         *             boolean indicating whether to include links in queries or not
         * @return {@code this} instance to enable chaining of method
         *         invocations
         */
        Query<QueryResultClass> setIncludeLinks(boolean includeLinks);

        /**
         * Executes the query and returns an iterator over list of pages of results. The iterator is
         * positioned just before the requested page so that calling {@code next()} returns the
         * requested page.
         * <p>
         * The returned iterator doesn't support mutating operations: {@code add}, {@code set}, and
         * {@code remove}. Invoking corresponding methods will result in
         * {@link UnsupportedOperationException}.
         *
         * @return an iterator over list of pages of results
         */
        ListIterator<QueryListPage<QueryResultClass>> execute();

        /**
         * Executes the query and returns an {@link Stream} of all results over all pages
         * <p>
         *
         * @return an iterator over list of pages of results
         */
        Stream<QueryResultClass> stream();

        /**
         * Convenience wrapper over {@link #execute()} for the case where exactly one match
         * is expected.
         * @return the matching row
         * @throws MissingRecordException if the number of matches is zero
         * @throws MultipleRecordsException if the number of matches is greatr than 1
         */
        QueryResultClass findUnique();
    }

    /**
     * Returns an instance of the {@link Query} object for the given query type name and query
     * result type.
     *
     * @param queryTypeName
     *            Query type name
     * @param queryResultClass
     *            Type of query results. Must be {@link ReferenceType} or a type derived from
     *            {@link QueryResultRecordType}.
     * @return an instance of the {@link Query} object
     */
    <QueryResultClass> Query<QueryResultClass> getQuery(String queryTypeName,
            Class<QueryResultClass> queryResultClass);

    /**
     * A generic class to store the {@link List} of items of the specified class, which are returned by
     * a typed query, and the total number of matching items, which might be greater than the number of
     * items returned.
     */
    public static class QueryListPage<T> {

        private final List<T> page;
        private final long totalItemCount;

        public QueryListPage(final List<T> queryResultRecordList, final long recordCount) {
            this.page = queryResultRecordList;
            this.totalItemCount = recordCount;
        }

        public List<T> getPage() {
            return page;
        }

        public long getTotalItemCount() {
            return totalItemCount;
        }
    }

    /**
     * Returns an instance of the {@link Query} object for a packaged query and query
     * result type.
     *
     * @param packagedQueryPath
     *            packaged query path in the format /{package}/query
     * @param queryResultClass
     *            Type of query results. Must be {@link ReferenceType} or a type derived from
     *            {@link QueryResultRecordType}.
     * @return an instance of the {@link Query} object
     */
    <QueryResultClass> Query<QueryResultClass> getPackagedQuery(String packagedQueryPath,
            Class<QueryResultClass> queryResultClass);
}
