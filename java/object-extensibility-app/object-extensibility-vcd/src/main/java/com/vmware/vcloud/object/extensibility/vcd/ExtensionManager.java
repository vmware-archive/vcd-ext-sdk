/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd;

import com.vmware.vcloud.api.rest.schema_v1_5.extension.ObjectExtensionType;

/**
 * Interface that defines functions for interacting with object extension management
 * calls against the vCloud Director API. <p>
 *
 * Before making these calls, the extension must authenticate to the vCloud API as
 * a system administrator.
 */
public interface ExtensionManager {
    /**
     * Registers an object extension with vCloud Director.
     *
     * @param objectExtension registration information about the extension
     * @return the registered extension
     */
    ObjectExtensionType registerExtension(final ObjectExtensionType objectExtension);

    ObjectExtensionType createObjectExtension();
}
