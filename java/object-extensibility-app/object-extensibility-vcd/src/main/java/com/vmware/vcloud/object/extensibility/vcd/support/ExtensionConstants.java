/* *****************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *****************************************************************************/

package com.vmware.vcloud.object.extensibility.vcd.support;

import com.vmware.vcloud.api.rest.schema_v1_5.extension.AmqpSettingsType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.ObjectExtensionType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.ObjectExtensionsType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.SystemSettingsType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.VimServerType;

interface ExtensionConstants {

    public static interface MediaType {
        public static final String XML_FORMAT_SUFFIX = "+xml";

        public static final String VIRTUAL_CENTERM = VimServerType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String SYSTEM_SETTINGSM = SystemSettingsType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String AMQP_SETTINGSM = AmqpSettingsType.CONTENT_TYPE + XML_FORMAT_SUFFIX;

        public static final String OBJECT_EXTENSION = ObjectExtensionType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String OBJECT_EXTENSIONS = ObjectExtensionsType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
    }
}
