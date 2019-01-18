/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import javax.ws.rs.WebApplicationException;

/**
 * Base exception to represent errors returned by VCD.
 * <P>
 * These are specifically errors returned by VCD in response to a request. The class of exceptions
 * caused while communicating with VCD or other such extraneous errors are NOT represented by this
 * exception or its sub-classes; those exceptions will be thrown as {@link ClientException}
 *
 */
public abstract class VcdErrorException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final int httpStatusCode;

    protected VcdErrorException(final int httpStatusCode, final WebApplicationException cause) {
        super(cause);
        this.httpStatusCode = httpStatusCode;
    }

    public final int getHttpStatusCode() {
        return httpStatusCode;
    }

    /**
     * Returns the original {@link WebApplicationException} returned by the framework
     *
     * {@inheritDoc}
     */
    @Override
    public final WebApplicationException getCause() {
        return (WebApplicationException)super.getCause();
    }

    @Override
    public String toString() {
        final String newLine = System.getProperty("line.separator");
        final StringBuilder builder = new StringBuilder();
        builder.append("VcdErrorException [HTTP status code = ").append(httpStatusCode).append("]").append(newLine);
        builder.append("Original cause: ").append(newLine).append(getCause());
        return builder.toString();
    }

    @Override
    public String getMessage() {
        return String.format("Error reported by VCD. HTTP status code: %d\n" +
                "Error message: %s", getHttpStatusCode(), getCause().getMessage());
    }
}
