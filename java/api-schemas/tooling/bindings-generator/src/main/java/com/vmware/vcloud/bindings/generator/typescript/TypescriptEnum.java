/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.bindings.generator.typescript;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;


public class TypescriptEnum extends TypescriptFile {
    TypescriptEnum(final Class<?> clazz) {
        setClazz(clazz);
    }

    @Override
    protected void processField(java.lang.reflect.Field field, Class<?> clazz) {
        if (!field.isEnumConstant()) {
            return;
        }

        addField(field.getName());
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
            .append("name", getName())
            .append("values", getFields()).toString();
    }
}
