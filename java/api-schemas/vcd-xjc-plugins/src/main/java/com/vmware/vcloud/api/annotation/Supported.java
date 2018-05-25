/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/

package com.vmware.vcloud.api.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation denotes when the specific feature was introduced to the
 * REST-API and if and when it was removed. This annotation is added
 * automatically to the JAXB generated classes.
 * <p>
 * The feature is present starting from {@link #addedIn()} version inclusive, to
 * {@link #removedIn()} exclusive.
 * </p>
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.TYPE })
public @interface Supported {

    /**
     * Version in which the feature was added.
     */
    String addedIn();

    /**
     * Version in which the feature was removed.
     */
    String removedIn() default "";
}
