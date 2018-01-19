/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.event;

import java.net.URI;

/**
 * Base implementation of a {@link VcdEvent}.
 */
public abstract class AbstractVcdEvent implements VcdEvent {
    private URI entity;
    private boolean operationSuccessful;

    @Override
    public URI getEntity() {
        return entity;
    }

    public void setEntity(URI entity) {
        this.entity = entity;
    }

    @Override
    public boolean isOperationSuccess() {
        return operationSuccessful;
    }

    @Override
    public void setOperationSuccess(boolean operationSuccessful) {
        this.operationSuccessful = operationSuccessful;
    }
}
