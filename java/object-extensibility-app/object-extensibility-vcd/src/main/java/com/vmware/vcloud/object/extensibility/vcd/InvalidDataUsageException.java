/* *
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * */
package com.vmware.vcloud.object.extensibility.vcd;

import java.net.URL;

/**
 * Exception thrown on an incorrect use of a data resource in an API call. <p>
 *
 * Thrown for example on specifying an invalid translation of returned data to another
 * Java type, like creating a {@link URL} from a {@link String} representation of a {@link URL}. <p>
 *
 * This exception can either indicate a misuse of an API data resource, or it
 * can indicate a problem in the underlying data resources in the API layer.
 */
public class InvalidDataUsageException extends RuntimeException {
    /**
     * Constructor for {@link InvalidDataUsageException}.
     *
     * @param message the detail message
     */
    public InvalidDataUsageException(final String message) {
        super(message);
    }

    /**
     * Constructor for {@link InvalidDataUsageException}.
     *
     * @param message the detail message
     * @param cause the root cause from the underlying vCloud Director system, or from
     * 	misuse of API data
     */
    public InvalidDataUsageException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
