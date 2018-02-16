/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.vcloud.api.rest.client;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.UriBuilder;

import com.vmware.vcloud.api.rest.client.constants.RestConstants;
import com.vmware.vcloud.api.rest.links.LinkRelation;
import com.vmware.vcloud.api.rest.schema_v1_5.EntityType;
import com.vmware.vcloud.api.rest.schema_v1_5.IdentifiableResourceType;
import com.vmware.vcloud.api.rest.schema_v1_5.LinkType;
import com.vmware.vcloud.api.rest.schema_v1_5.ReferenceType;
import com.vmware.vcloud.api.rest.schema_v1_5.ResourceType;
import com.vmware.vcloud.api.rest.schema_v1_5.TaskType;
import com.vmware.vcloud.api.rest.schema_v1_5.TasksInProgressType;

/**
 * Miscellaneous utility methods for use when working with {@link VcdClient}s.
 */
public class VcdUtils {

    /**
     * Constructs a {@code URI} which has the correct delete parameters set as {@code URL}
     * parameters if applicable
     *
     * @param baseHref
     * @param force
     *            {@code true}, {@code false} or {@code null} which indicates the parameter should
     *            be omitted
     * @param recursive
     *            {@code true}, {@code false} or {@code null} which indicates the parameter should
     *            be omitted
     * @return a {@code URI} which can be further altered by the caller if necessary.
     */
    public static URI buildDeleteUri(final URI baseHref, final Boolean force, final Boolean recursive) {

        final UriBuilder builder = UriBuilder.fromUri(baseHref);

        if (force != null) {
            builder.queryParam(RestConstants.DeleteParameters.FORCE, force);
        }

        if (recursive != null) {
            builder.queryParam(RestConstants.DeleteParameters.RECURSIVE, recursive);
        }

        return builder.build();
    }

    /**
     * Gets an entity's ID in a form that can be used as an input parameter to a service method that
     * expects an ID.
     *
     * TODO: The existence of this method is an indication of a flaw in the nature of
     * {@link VcdClient} and/or CXF's REST client support. The vCloud API, being a "proper" sort of
     * REST, returns links to resources in its responses with the idea that clients traverse the
     * graph of vCloud objects by following those links. However, the vCloud JAX-RS
     * interfaces/handlers are "service-oriented" in a way that makes it hard to usefully represent
     * those links in a CXF REST client. Instead, clients end up doing the bad thing of using entity
     * IDs to compose URLs (CXF composes them on the clients behalf, using JAX-RS annotations in the
     * vCloud JAX-RS interfaces, which is just as bad), rather than simply following returned links.
     * We should figure out if there's a way to do better.
     */
    public static String getEntityId(EntityType entityType) {
        // TODO: Do better?
        return entityType.getId().split(":")[3];
    }

    /**
     * Returns the link of the specified rel and type in the specified resource
     * @param resource the resource with the link
     * @param rel the rel of the desired link
     * @param mediaType media type of content
     * @return the link
     * @throws MissingLinkException if no link of the specified rel and media type is found
     * @throws MultipleLinksException if multiple links of the specified rel and media type are found
     */
    public static LinkType findLink(ResourceType resource, LinkRelation rel, String mediaType) throws MissingLinkException, MultipleLinksException {
        return findLink(resource, rel, mediaType, true);
    }

    /**
     * Returns the link of the specified rel and type in the specified resource
     * @param resource the resource with the link
     * @param rel the rel of the desired link
     * @param mediaType media type of content
     * @param failIfAbsent controls whether an exception is thrown if there's not exactly one link of the specified rel and media type
     * @return the link, or null if no such link is present and failIfAbsent is false
     * @throws MissingLinkException if no link of the specified rel and media type is found
     * @throws MultipleLinksException if multiple links of the specified rel and media type are found
     */
    public static LinkType findLink(ResourceType resource, LinkRelation rel, String mediaType, boolean failIfAbsent) throws MissingLinkException, MultipleLinksException {
        List<LinkType> links = getLinks(resource, rel, mediaType);
        switch (links.size()) {
        case 0:
            if (failIfAbsent) {
                throw new MissingLinkException(resource.getHref(), rel, mediaType);
            } else {
                return null;
            }
        case 1:
            return links.get(0);
        default:
            throw new MultipleLinksException(resource.getHref(), rel, mediaType);
        }
    }

    /**
     * Returns all the links of the specified rel and type in the specified resource
     * @param resource the resource with the link
     * @param rel the rel of the desired link
     * @param mediaType media type of content
     * @return the links (could be an empty list)
     */
    public static List<LinkType> getLinks(ResourceType resource, LinkRelation rel, String mediaType) {
        List<LinkType> links = new ArrayList<LinkType>();
        for (LinkType link : resource.getLink()) {

            try {
                if (link.getRel().equals(rel.value())) {
                    if (mediaType == null && link.getType() == null) {
                        links.add(link);
                    } else if (mediaType != null && link.getType().equals(mediaType)) {
                        links.add(link);
                    }
                }
            } catch (IllegalArgumentException e) {
                // See comment in corresponding catch in findLink().
            }
        }
        return links;
    }

    /**
     * Convenience method to turn a {@link ResourceType} into a {@link ReferenceType} to that resource.
     */
    public static ReferenceType makeRef(ResourceType resource) {
        ReferenceType ref = new ReferenceType();
        ref.setHref(resource.getHref());
        ref.setType(resource.getType());
        return ref;
    }

    /**
     * Convenience method to turn an {@link IdentifiableResourceType} into a {@link ReferenceType} to that resource.
     */
    public static ReferenceType makeRef(IdentifiableResourceType identifiableResource) {
        ReferenceType ref = makeRef((ResourceType) identifiableResource);
        ref.setId(identifiableResource.getId());
        return ref;
    }

    /**
     * Convenience method to turn an {@link EntityType} into a {@link ReferenceType} to that entity.
     */
    public static ReferenceType makeRef(EntityType entity) {
        ReferenceType ref = makeRef((IdentifiableResourceType) entity);
        ref.setName(entity.getName());
        return ref;
    }

    /**
     * Convenience method to turn a {@link LinkType} into a {@link ReferenceType} to the linked-to resource.
     */
    public static ReferenceType makeRef(LinkType link) {
        ReferenceType ref = new ReferenceType();
        ref.setHref(link.getHref());
        return ref;
    }

    /**
     * Convenience method to turn a {@link String} of an URL into a {@link ReferenceType} with that URL.
     */
    public static ReferenceType makeRef(String href) {
        ReferenceType ref = new ReferenceType();
        ref.setHref(href);
        return ref;
    }

    /**
     *
     * Convenience method to get {@link TaskType} from given resource.
     *
     * @throws RuntimeException
     *             if more than one {@link TaskType} found in given resource.
     */
    public static <T extends EntityType> TaskType getTask(T entityType) {
        final TasksInProgressType tasks = entityType.getTasks();
        if (tasks == null) {
            throw new RuntimeException("No tasks found. Expected one task");
        }

        final List<TaskType> taskList = tasks.getTask();
        if (taskList.size() != 1) {
            throw new RuntimeException("Expected one task, got " + taskList.size());
        }
        return taskList.get(0);
    }
}
