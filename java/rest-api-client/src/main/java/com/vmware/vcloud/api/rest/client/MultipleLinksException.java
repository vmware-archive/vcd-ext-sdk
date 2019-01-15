/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.vcloud.api.rest.client;

import com.vmware.vcloud.api.rest.links.LinkRelation;

/**
 * An exception to indicate that a resource being queried for a single &lt;link&gt; element of
 * a particular rel and media type in fact has multiple matching such elements.
 */
public class MultipleLinksException extends LinkException {
    private static final long serialVersionUID = 1L;

    public MultipleLinksException(String href, LinkRelation rel, String mediaType) {
        super(href, rel, mediaType);
    }

}
