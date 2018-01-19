/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import javax.ws.rs.WebApplicationException;

import com.vmware.vcloud.api.rest.schema_v1_5.ErrorType;

/**
 * Exception for encapsulating errors returned by VCD as Jaxb {@link ErrorType} object
 *
 */
public class VcdErrorResponseException extends VcdErrorException {
    private static final long serialVersionUID = 1L;

    private final ErrorType vcdError;
    private final String requestId;
    private final String errorMsg;

    public VcdErrorResponseException(int httpStatusCode, final String requestId,
            ErrorType vcdError, WebApplicationException cause) {
        super(httpStatusCode, cause);
        this.requestId = requestId;
        this.vcdError = vcdError;
        this.errorMsg = vcdError != null ? vcdError.getMessage() : null;
    }

    public VcdErrorResponseException(int httpStatusCode, final String requestId,
            String vcdError, WebApplicationException cause) {
        super(httpStatusCode, cause);
        this.requestId = requestId;
        this.errorMsg = vcdError;
        this.vcdError = null;
    }

    /**
     *
     * @return Jaxb {@link ErrorType} object representing the error returned by VCD as defined by
     */
    public final ErrorType getVcdError() {
        return vcdError;
    }

    /**
     * @return ID of the failed request
     */
    public final String getRequestId() {
        return requestId;
    }

    @Override
    public String toString() {
        return String.format("[VcdErrorResponseException] %s\n" +
                        "Server stack trace: %s",
                        getMessage(), (vcdError == null) ? errorMsg : vcdError.getStackTrace());
    }

    @Override
    public String getMessage() {
        return String.format("HTTP status code = %d\n" +
                        "Request ID: %s\n" +
                        "VCD Error: %s\n" +
                        "VCD ErrorType: major error code = %d, minor error code = %s",
                getHttpStatusCode(),
                requestId,
                (vcdError == null) ? errorMsg : vcdError.getMessage(),
                (vcdError == null) ? 0 : vcdError.getMajorErrorCode(),
                (vcdError == null) ? "-" : vcdError.getMinorErrorCode());
    }
}
