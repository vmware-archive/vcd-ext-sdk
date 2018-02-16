/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.support;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vmware.vcloud.api.rest.client.VcdClient;
import com.vmware.vcloud.api.rest.schema_v1_5.QueryResultVirtualCenterRecordType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.VimServerType;
import com.vmware.vcloud.object.extensibility.vcd.InvalidDataUsageException;
import com.vmware.vcloud.object.extensibility.vcd.VcenterInfo;
import com.vmware.vcloud.object.extensibility.vcd.VcenterManager;

/**
 * Default implementation of {@link VcenterManager}.
 */
public class VcenterManagerImpl implements VcenterManager {
    private static final Logger LOG = LoggerFactory.getLogger(VcenterManagerImpl.class);

    private final VcdClient vcdClient;

    public VcenterManagerImpl(final VcdClient vcdClient) {
        this.vcdClient = vcdClient;
    }

    @Override
    public Set<VcenterInfo> getAllRegisteredVcenters() {
        return vcdClient.getPackagedQuery("/admin/extension/vimServerReferences/query", QueryResultVirtualCenterRecordType.class)
            .setPageSize(128)
            .stream()
            .map(record -> processVcenterRecord(record)).collect(Collectors.toSet());
    }

    @Override
    public VcenterInfo getVcenterInfo(final String entity) {
        return createVcenterInfo(vcdClient.getEntity(entity, ExtensionConstants.MediaType.VIRTUAL_CENTERM, VimServerType.class));
    }

    private VcenterInfo processVcenterRecord(final QueryResultVirtualCenterRecordType record) {
        try {
            return new DefaultVcenterInfo(new URL(record.getUrl()), record.isIsEnabled(), record.getVcVersion());
        } catch (final MalformedURLException e) {
            LOG.error("Cannot create URL instance from the vCenter record's URL String {0}", record.getUrl());
            throw new InvalidDataUsageException("URL creation failed", e);
        }
    }

    private VcenterInfo createVcenterInfo(final VimServerType type) {
        try {
            return new DefaultVcenterInfo(new URL(type.getUrl()), type.isIsEnabled(), type.getVcVersion());
        } catch (final MalformedURLException e) {
            LOG.error("Cannot create URL instance from the vCenter record's URL String {0}", type.getUrl());
            throw new InvalidDataUsageException("URL creation failed", e);
        }
    }
}
