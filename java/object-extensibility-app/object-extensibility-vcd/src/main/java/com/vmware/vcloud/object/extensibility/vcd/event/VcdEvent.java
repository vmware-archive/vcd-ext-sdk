/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd.event;

import java.net.URI;

/**
 * Interface for the data representation of events from vCloud Director.
 */
public interface VcdEvent {
    /**
     * Gets a flag indicating whether or not the event completed successfully.
     *
     * @return true if successful
     */
    boolean isOperationSuccess();

    /**
     * Sets the event completion success flag
     *
     * @param operationSuccess true if successful
     */
    void setOperationSuccess(boolean operationSuccess);

    /**
     * Gets a URI representation of the source entity for the event.
     *
     * @return an entity URI
     */
    URI getEntity();

    /**
     * Sets the source entity for the event.
     *
     * @param entity an entity URI
     */
    void setEntity(URI entity);
}
