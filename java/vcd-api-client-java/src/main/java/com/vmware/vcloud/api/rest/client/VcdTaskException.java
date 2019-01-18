/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import com.vmware.vcloud.api.rest.schema_v1_5.ErrorType;
import com.vmware.vcloud.api.rest.schema_v1_5.ReferenceType;

/**
 * Exception thrown when task failed to complete.
 */
public class VcdTaskException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private final ReferenceType owner;
    private final ErrorType error;
    private final String errorMessage;

    public VcdTaskException(ReferenceType owner, final String errorMessage, final ErrorType error) {
        this.owner = owner;
        this.errorMessage = errorMessage;
        this.error = error;
    }

    public ReferenceType getOwner() {
        return owner;
    }

    /**
     * @return the value of error property.
     */
    public ErrorType getError() {
        return error;
    }

    /**
     * @return error message.
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    @Override
    public String toString() {
        return String.format("[VcdTaskException] %s\n" +
                        "Server stack trace: %s",
                        getMessage(), (error == null) ? null : error.getStackTrace());
    }

    @Override
    public String getMessage() {
        return String.format("VCD Error: %s\n" +
                        "VCD ErrorType: major error code = %d, minor error code = %s",
                (error == null) ? null : error.getMessage(),
                (error == null) ? 0 : error.getMajorErrorCode(),
                (error == null) ? "-" : error.getMinorErrorCode());
    }
}
