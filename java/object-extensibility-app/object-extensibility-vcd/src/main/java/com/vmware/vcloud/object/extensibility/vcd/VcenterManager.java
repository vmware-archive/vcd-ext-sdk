/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd;

import java.util.Set;

/**
 * Interface that defines functions for interacting with vCenter-related
 * calls against the vCloud Director API. <p>
 *
 * Before making these calls, the extension must authenticate to the vCloud API as
 * a system administrator.
 */
public interface VcenterManager {
    /**
     * Gets all the vCenters that are currently registered with a vCloud Director installation.
     *
     * @return a set of information about registered vCenters
     */
    Set<VcenterInfo> getAllRegisteredVcenters();

    VcenterInfo getVcenterInfo(String entity);
}
