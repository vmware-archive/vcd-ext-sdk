/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.support;

import com.vmware.vcloud.api.rest.client.VcdClient;
import com.vmware.vcloud.api.rest.client.constants.RelationType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.ObjectExtensionType;
import com.vmware.vcloud.object.extensibility.vcd.ExtensionManager;

/**
 * Default implementation of {@link ExtensionManager}.
 */
public class ExtensionManagerImpl implements ExtensionManager {
    private final VcdClient vcdClient;

    public ExtensionManagerImpl(final VcdClient vcdClient) {
        this.vcdClient = vcdClient;
    }

    @Override
    public ObjectExtensionType registerExtension(final ObjectExtensionType objectExtension) {
        return vcdClient.postResource(vcdClient.getExtension(), RelationType.ADD, ExtensionConstants.MediaType.OBJECT_EXTENSION,
                vcdClient.getVCloudExtensionObjectFactory().createObjectExtension(objectExtension),
                ObjectExtensionType.class);
    }

    @Override
    public ObjectExtensionType createObjectExtension() {
        return vcdClient.getVCloudExtensionObjectFactory().createObjectExtensionType();
    }
}
