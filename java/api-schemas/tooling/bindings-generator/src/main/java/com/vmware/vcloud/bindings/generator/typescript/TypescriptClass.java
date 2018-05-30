/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.bindings.generator.typescript;

import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.WildcardType;
import java.util.Collection;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.apache.commons.lang3.reflect.TypeUtils;

public class TypescriptClass extends TypescriptFile {
    private Class<?> parent;
    private boolean isAbstract;

    TypescriptClass(final Class<?> clazz) {
        setClazz(clazz);

        if (clazz.getSuperclass() != Object.class) {
            this.parent = clazz.getSuperclass();
            addImport(clazz, this.parent);
        }

        isAbstract = Modifier.isAbstract(clazz.getModifiers());
    }

    public String getParent() {
        return parent == null ? null : parent.getSimpleName();
    }

    public boolean getIsAbstract() {
        return isAbstract;
    }

    @Override
    protected void processField(java.lang.reflect.Field field, Class<?> clazz) {
        if (Modifier.isStatic(field.getModifiers())) {
            return;
        }

        final TypescriptMapper mapper = new TypescriptMapper();

        Type genericType = field.getGenericType();
        boolean isArray = TypeUtils.isArrayType(genericType) || TypeUtils.isAssignable(genericType, Collection.class);

        Type actualType = genericType;
        while (actualType instanceof ParameterizedType) {
            actualType = ((ParameterizedType) actualType).getActualTypeArguments()[0];
            if (actualType instanceof WildcardType) {
                actualType = ((WildcardType) actualType).getUpperBounds()[0];
            }
        }

        addField(field.getName(), mapper.getTypeName(actualType) + ((isArray) ? "[]" : ""));
        if (!mapper.isBuiltInType(actualType) && !actualType.getTypeName().startsWith("java")) {
            addImport(clazz, (Class <?>) actualType);
        }
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
            .append("name", getName())
            .append("isAbstract", isAbstract).toString();
    }
}
