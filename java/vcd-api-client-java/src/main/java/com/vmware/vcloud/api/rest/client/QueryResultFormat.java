/* ******************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * ******************************************************************************/
package com.vmware.vcloud.api.rest.client;

import java.util.List;

import com.vmware.vcloud.api.rest.client.constants.RestConstants;
import com.vmware.vcloud.api.rest.schema_v1_5.EntityType;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultRecordType;
import com.vmware.vcloud.api.rest.schema_v1_5.ResourceType;

/**
 * Form of result returned by a query.
 *
 * @since vCloud API 1.5.
 */
public enum QueryResultFormat {
    /**
     * Return records from the query. The return type of such a query will be a {@link List} of
     * objects which are assignable to {@link QueryResultRecordType}.
     *
     * @since vCloud API 1.5.
     */
    RECORDS(RestConstants.MediaType.RECORDS, "records"),

    /**
     * Return records from the query, where references to other entities are typed by vCloud
     * globally-unique ID rather than by Entity. The return type of such a query will be a
     * {@link List} of objects which are assignable to {@link QueryResultRecordType}.
     *
     * @since vCloud API 1.5.
     */
    ID_RECORDS(RestConstants.MediaType.IDRECORDS, "idrecords"),

    /**
     * Return references only from the query. The return type of such a query will be a {@code List}
     * of {@link EntityType} or {@link ResourceType} instances.
     *
     * @since vCloud API 1.5.
     */
    REFERENCES(RestConstants.MediaType.REFERENCES, "references");

    private String mediaType;
    private String apiString;

    private QueryResultFormat(String mediaType, String apiString) {
        this.mediaType = mediaType;
        this.apiString = apiString;
    }

    public String getMediaType() {
        return mediaType;
    }

    public String getApiString() {
        return apiString;
    }
}
