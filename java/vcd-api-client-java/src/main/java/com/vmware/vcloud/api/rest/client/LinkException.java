/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.vcloud.api.rest.client;

import com.vmware.vcloud.api.rest.links.LinkRelation;

/**
 * Base class for exceptions related to operations on &lt;link&gt; elements in responses.
 */
public abstract class LinkException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private final String href;
    private final LinkRelation rel;
    private final String mediaType;

    protected LinkException(String href, LinkRelation rel, String mediaType) {
        this.href = href;
        this.rel = rel;
        this.mediaType = mediaType;
    }

    public LinkRelation getRel() {
        return rel;
    }

    public String getMediaType() {
        return mediaType;
    }

    @Override
    public String toString() {
        return String.format("%s; href: %s, rel: %s, mediaType: %s", super.toString(), href, rel, mediaType);
    }
}
