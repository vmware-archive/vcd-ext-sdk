/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/

package com.vmware.vcloud.api.rest.client.constants;

import com.vmware.vcloud.api.rest.schema_v1_5.AdminOrgType;
import com.vmware.vcloud.api.rest.schema_v1_5.VCloudType;

public interface RestAdminConstants {

    public static interface MediaType {
        public static final String XML_FORMAT_SUFFIX = "+xml";
        public static final String JSON_FORMAT_SUFFIX = "+json";

        public static final String VCLOUDM = VCloudType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String ORGANIZATIONM = AdminOrgType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
    }
}
