/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.vcloud.api.rest.client;

/**
 * An exception to indicate that a query failed to return an expected record.
 */
public class MissingRecordException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public MissingRecordException() {
    }

    public MissingRecordException(String message) {
        super(message);
    }

    public MissingRecordException(String message, Throwable t) {
        super(message, t);
    }

    public MissingRecordException(Throwable t) {
        super(t);
    }
}
