/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.bindings.generator.typescript;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.WildcardType;
import java.util.Date;

import javax.xml.datatype.Duration;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.namespace.QName;

import org.apache.commons.lang3.ClassUtils;
import org.apache.commons.lang3.reflect.TypeUtils;

public class TypescriptMapper {
    public boolean isBuiltInType(Type type) {
        return isBooleanType(type)
                || isDateType(type)
                || isNumberType(type)
                || isStringType(type);
    }

    private String getInternalTypeName(final Type type) {
        if (isBooleanType(type)) {
            return "boolean";
        }

        if (isDateType(type)) {
            return "Date";
        }

        if (isNumberType(type)) {
            return "number";
        }

        if (isStringType(type)) {
            return "string";
        }

        return null;
    }

    private boolean isBooleanType(final Type type) {
        return TypeUtils.isAssignable(type, boolean.class)
                || TypeUtils.isAssignable(type, Boolean.class);
    }

    private boolean isNumberType(final Type type) {
        return TypeUtils.isAssignable(type, Number.class)
                || TypeUtils.isAssignable(type, byte.class)
                || TypeUtils.isAssignable(type, short.class)
                || TypeUtils.isAssignable(type, int.class)
                || TypeUtils.isAssignable(type, long.class)
                || TypeUtils.isAssignable(type, float.class)
                || TypeUtils.isAssignable(type, double.class);
    }

    private boolean isStringType(final Type type) {
        return TypeUtils.isAssignable(type, String.class)
                || TypeUtils.isAssignable(type, char[].class)
                || TypeUtils.isAssignable(type, byte[].class)
                || TypeUtils.isAssignable(type, Duration.class);
    }

    private boolean isDateType(final Type type) {
        return TypeUtils.isAssignable(type, XMLGregorianCalendar.class)
                || TypeUtils.isAssignable(type, Date.class);
    }

    public String getTypeName(final Type type) {
        if (type instanceof ParameterizedType) {
            final ParameterizedType parameterizedType = (ParameterizedType) type;
            Type superType = parameterizedType.getActualTypeArguments()[0];
            return getTypeName(superType);
        }

        if (type instanceof Class) {
            if (((Class<?>) type).equals(Object.class)) {
                return "object";
            }

            if (((Class<?>) type).equals(QName.class)) {
                return "object";
            }

            String name = getInternalTypeName(type);
            return name != null ? name : ClassUtils.getSimpleName((Class<?>) type);
        }

        if (type instanceof WildcardType) {
            Type superType = ((WildcardType) type).getUpperBounds()[0];

            if (superType instanceof Class) {
                String name = getInternalTypeName(superType);
                return name != null ? name : ClassUtils.getSimpleName((Class<?>) superType);
            }
        }

        throw new IllegalArgumentException("Unable to determine type name for " + type);
    }
}
