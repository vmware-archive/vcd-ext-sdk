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
 * Defines the content type of an entity. This annotation is not meant to be
 * added manually, rather one should annotate the XSDs.
 *
 * @see com.vmware.vcloud.xjcplugin.RestApiVersionsPlugin
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE })
public @interface ContentType {
    String value();
}
