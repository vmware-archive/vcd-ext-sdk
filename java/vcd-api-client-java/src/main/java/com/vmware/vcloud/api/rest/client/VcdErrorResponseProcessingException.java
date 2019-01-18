/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import javax.ws.rs.WebApplicationException;

/**
 * Exception to note that error returned by VCD cannot be processed. The original exception in its
 * raw form and the processing error are both captured
 *
 */
public class VcdErrorResponseProcessingException extends VcdErrorException {
    private static final long serialVersionUID = 1L;
    private final Exception processingException;

    public VcdErrorResponseProcessingException(int httpStatusCode, Exception processingException,
            WebApplicationException cause) {
        super(httpStatusCode, cause);
        this.processingException = processingException;
    }

    public final Exception getErrorResponseProcessingException() {
        return processingException;
    }

    @Override
    public String toString() {
        return String.format("[VcdErrorResponseProcessingException] HTTP Status Code=%d\n" +
                        "Processing Exception %s\n" +
                        "while processing VCD Exception received: %s",
                        getHttpStatusCode(),
                        processingException == null ? null : processingException.toString(),
                        getCause() == null ? null : getCause().toString());
    }

    @Override
    public String getMessage() {
        return String.format("Exception occured while processing Error response received from VCD.\n" +
                        "HTTP Status Code: %d, Original error: %s\n" +
                        "Processsing Error: %s",
                        getHttpStatusCode(),
                        getCause() == null ? null : getCause().getMessage(),
                        processingException == null ? null : processingException.getMessage());
    }
}
