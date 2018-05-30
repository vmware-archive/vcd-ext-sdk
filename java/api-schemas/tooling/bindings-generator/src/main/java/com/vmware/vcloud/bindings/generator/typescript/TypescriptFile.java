/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.bindings.generator.typescript;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public abstract class TypescriptFile {
    private Class<?> clazz;

    private Set<Import> imports = new HashSet<>();
    private List<Field> fields = new ArrayList<>();

    public Set<Import> getImports() {
        return Collections.unmodifiableSet(imports);
    }

    public List<Field> getFields() {
        return Collections.unmodifiableList(fields);
    }

    public static TypescriptClass createClass(final Class<?> clazz) {
        Objects.requireNonNull(clazz);
        if (clazz.isEnum()) {
            throw new IllegalArgumentException("Can't create Typescript class for enum " + clazz.getSimpleName() + ".  Try creating Typescript enum instead.");
        }

        final TypescriptClass tc = new TypescriptClass(clazz);
        Arrays.stream(clazz.getDeclaredFields()).forEach(field -> tc.processField(field, clazz));

        return tc;
    }

    public static TypescriptEnum createEnum(final Class<?> clazz) {
        Objects.requireNonNull(clazz);
        if (!clazz.isEnum()) {
            throw new IllegalArgumentException("Can't create Typescript enum for class " + clazz.getSimpleName() + ".  Try creating Typescript class instead.");
        }

        TypescriptEnum te = new TypescriptEnum(clazz);
        Arrays.stream(clazz.getDeclaredFields()).forEach(field -> te.processField(field, clazz));

        return te;
    }

    public String getName() {
        return clazz.getSimpleName();
    }

    protected Class<?> getClazz() {
        return clazz;
    }

    protected void setClazz(Class<?> clazz) {
        this.clazz = clazz;
    }

    protected void addField(final String name, final String type) {
        Field field = new Field();
        field.name = name;
        field.type = type;

        fields.add(field);
    }

    protected void addField(final String name) {
        Field field = new Field();
        field.name = name;

        this.fields.add(field);
    }

    protected void addImport(final Class<?> usingClass, final Class<?> referencedClass) {
        if (referencedClass == null || referencedClass.getName().startsWith("java")) {
            return;
        }

        Path usingClassPath = Paths.get(usingClass.getPackage().getName().replace(".", "/")).normalize();
        Path referencedClassPath = Paths.get(referencedClass.getName().replace(".", "/")).normalize();

        this.imports.add(new Import(referencedClass.getSimpleName(), "./" + usingClassPath.relativize(referencedClassPath).toString().replace("\\", "/")));
    }

    protected abstract void processField(final java.lang.reflect.Field field, final Class<?> clazz);

    public static class Import {
        private String definition;
        private String module;

        public Import(final String definition, final String module) {
            this.definition = definition;
            this.module = module;
        }

        public String getDefinition() {
            return definition;
        }

        public String getModule() {
            return module;
        }

        @Override
        public boolean equals(Object obj) {
            if (!(obj instanceof Import)) {
                return false;
            }

            Import other = (Import) obj;
            return Objects.equals(this.definition, other.definition) && Objects.equals(this.module, other.module);
        }

        @Override
        public int hashCode() {
            return Objects.hash(this.definition, this.module);
        }
    }

    public static class Field {
        private String name;
        private String type;
        private boolean required;

        public String getName() {
            return name;
        }

        public String getType() {
            return type;
        }

        public boolean isRequired() {
            return required;
        }

        @Override
        public String toString() {
            ToStringBuilder builder = new ToStringBuilder(this, ToStringStyle.NO_CLASS_NAME_STYLE).append(getName());
            if (type != null) {
                builder.append(": ").append(type);
            }

            return builder.toString();
        }
    }
}
