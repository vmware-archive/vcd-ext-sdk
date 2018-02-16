/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.support;

import java.net.URL;

import com.vmware.vcloud.object.extensibility.vcd.VcenterInfo;

/**
 * Default implementation of the {@link VcenterInfo} interface.
 */
public class DefaultVcenterInfo implements VcenterInfo {
    private final URL url;
    private final boolean enabled;
    private final String version;

    public DefaultVcenterInfo(final URL url, final boolean enabled, final String version) {
        this.enabled = enabled;
        this.url = url;
        this.version = version;
    }

    @Override
    public URL getUrl() {
        return url;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String getVersion() {
        return version;
    }

    @Override
    public String toString() {
        return "DefaultVcenterInfo [url=" + url + ", enabled=" + enabled
                + ", version=" + version + "]";
    }
}
