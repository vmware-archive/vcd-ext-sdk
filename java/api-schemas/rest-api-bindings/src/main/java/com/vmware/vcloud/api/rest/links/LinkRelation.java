/* **********************************************************
 * api-extension-template-vcloud-director
 * Copyright 2013-2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **********************************************************/
package com.vmware.vcloud.api.rest.links;


/**
 * Represents relation of a link in representational state of a resource to that resource.
 */
public interface LinkRelation {

    /**
     * @return the value of {@code rel} attribute of {@code LinkType} element.
     */
    String value();
}
