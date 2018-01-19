/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd;

import java.net.URL;

/**
 * Interface that defines the properties of a vCenter that is registered
 * with vCloud Director.
 */
public interface VcenterInfo {
    /**
     * Gets the URL for accessing this vCenter instance.
     *
     * @return a URL instance
     */
    URL getUrl();

    /**
     * Gets a flag indicating whether or not the vCenter instance is enabled within the
     * vCloud Director install.
     *
     * @return true if the vCenter instance is enabled in vCloud Director
     */
    boolean isEnabled();

    /**
     * Gets the software version of this vCenter instance.
     *
     * @return a version string
     */
    String getVersion();
}
