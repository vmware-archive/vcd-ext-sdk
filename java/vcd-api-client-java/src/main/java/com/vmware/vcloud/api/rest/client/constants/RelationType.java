/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **********************************************************************/

package com.vmware.vcloud.api.rest.client.constants;

import com.vmware.vcloud.api.rest.links.LinkRelation;
import com.vmware.vcloud.api.rest.version.ApiVersion;



/**
 * Contains a relation(rel) which a link provide to a resource or operation.
 * Each Relation type consist of (value, apiVersion) pair. The value is the presentation value for this rel;
 * The version is the version in which this RelationType is introduced.
 *
 * <Link rel="" type="" href=""/>
 *

 */
public enum RelationType implements LinkRelation {

    SELF("self", ApiVersion.VERSION_1_5),
    DOWN("down", ApiVersion.VERSION_1_5),
    ADD("add", ApiVersion.VERSION_1_5),
    UP("up", ApiVersion.VERSION_1_5),
    EDIT("edit", ApiVersion.VERSION_1_5),
    REMOVE("remove", ApiVersion.VERSION_1_5),
    ALTERNATE("alternate", ApiVersion.VERSION_1_5),
    PREVIOUS_PAGE("previousPage", ApiVersion.VERSION_1_5),
    NEXT_PAGE("nextPage", ApiVersion.VERSION_1_5),
    FIRST_PAGE("firstPage",ApiVersion.VERSION_1_5),
    LAST_PAGE("lastPage", ApiVersion.VERSION_1_5),
    ENTITY_RESOLVER("entityResolver", ApiVersion.VERSION_1_5),
    API_EXTENSIBILITY("down:extensibility", ApiVersion.VERSION_5_1),
    OPENAPI("openapi", ApiVersion.VERSION_29_0);

    private final String value;
    private final ApiVersion apiVersion;

    @Override
    public String value() {
    	return value;
    }

    RelationType(String value, ApiVersion apiVersion) {
        this.value = value;
        this.apiVersion = apiVersion;
    }

    public ApiVersion apiVersion() {
        return apiVersion;
    }

}
