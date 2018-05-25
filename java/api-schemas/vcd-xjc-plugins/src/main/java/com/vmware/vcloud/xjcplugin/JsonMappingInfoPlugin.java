/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2015-2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.xjcplugin;

import java.util.ArrayList;
import java.util.List;

import org.xml.sax.ErrorHandler;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.sun.codemodel.JAnnotatable;
import com.sun.codemodel.JAnnotationArrayMember;
import com.sun.codemodel.JAnnotationUse;
import com.sun.tools.xjc.Options;
import com.sun.tools.xjc.Plugin;
import com.sun.tools.xjc.model.CCustomizations;
import com.sun.tools.xjc.model.CPluginCustomization;
import com.sun.tools.xjc.outline.ClassOutline;
import com.sun.tools.xjc.outline.Outline;

import org.jvnet.jaxb2_commons.util.CustomizationUtils;

/**
 * <code>JsonMappingInfoPlugin</code> is a plug-in for the JAXB's XJC code generator. It adds
 * {@link JsonTypeInfo} and {@link JsonSubTypes} annotations to the generated JAXB classes. This
 * facilitates mapping between abstract types and JSON objects
 * <p>
 * To activate it, add the following parameters to the XJC command line:<br>
 *
 * <pre>
 * -enable -Xjsonapi
 * </pre>
 *
 * Add the following to parent type
 * in the XSD:
 *
 * <pre>
 * &lt;xs:appinfo&gt;
 *     &lt;meta:jsonTypeInfo propertyName="type" /&gt;
 * &lt;/xs:appinfo&gt;
 * </pre>
 *
 * Add the following to any sub type(s) in the XSD:
 *
 * <pre>
 * &lt;xs:appinfo&gt;
 *     &lt;meta:jsonSubTypeInfo name="string" /&gt;
 * &lt;/xs:appinfo&gt;
 * </pre>
 *
 *
 * </p>
 * <p>
 * You also have to add the following boilerplate to the beginning of the XSD:
 *
 * <pre>
 *   xmlns:jaxb="http://java.sun.com/xml/ns/jaxb"
 *   xmlns:meta="http://www.vmware.com/vcloud/meta"
 *   jaxb:verion="2.0"
 *   jaxb:extensionBindingPrefixes="meta"
 * </pre>
 */
public class JsonMappingInfoPlugin extends Plugin {

    private static final String X_ANNOTATION_JSON_TYPE_PROPERTY_NAME = "propertyName";
    private static final String X_ANNOTATION_JSON_SUBTYPE_NAME = "name";
    private static final String NAMESPACE_URI = "http://www.vmware.com/vcloud/plugin/json";
    private static final String ELEMENT_JSON_TYPE = "jsonTypeInfo";
    private static final String ELEMENT_JSON_SUBTYPE_TYPE = "jsonSubTypeInfo";
    private static final String PLUGIN_OPTION = "Xjson-api";

    @Override
    public String getOptionName() {
        return PLUGIN_OPTION;
    }

    @Override
    public List<String> getCustomizationURIs() {
        ArrayList<String> res = new ArrayList<String>(1);
        res.add(NAMESPACE_URI);
        return res;
    }

    @Override
    public boolean isCustomizationTagName(String nsUri, String localName) {
        return NAMESPACE_URI.equals(nsUri)
                && (ELEMENT_JSON_TYPE.equals(localName) || ELEMENT_JSON_SUBTYPE_TYPE.equals(localName));
    }

    @Override
    public String getUsage() {
        return "  -" + PLUGIN_OPTION + ": enables the plugin\n";
    }

    @Override
    public boolean run(Outline outline, Options options, ErrorHandler errorHandler) {

        for (ClassOutline classOutline : outline.getClasses()) {
            final CCustomizations customizations = CustomizationUtils.getCustomizations(classOutline);
            addJsonMappingAnnotations(classOutline, customizations);
        }
        return true;
    }

    /**
     * Adds {@link JsonTypeInfo} or {@link JsonSubTypes} annotations to the given element based on
     * the schema annotations present.
     *
     * @param classOutline
     *            {@link ClassOutline} for the element which will be annotated
     * @param customizations
     *            schema customizations for this element
     */
    private void addJsonMappingAnnotations(
            final ClassOutline classOutline,
            final CCustomizations customizations) {

        final JAnnotatable annotatable = classOutline.implClass;

        if (annotatable == null) {
            return;
        }

        final CPluginCustomization parentTypeCustomization = customizations.find(NAMESPACE_URI, ELEMENT_JSON_TYPE);

        if (parentTypeCustomization != null) {
            String typePropertyName = null;

            parentTypeCustomization.markAsAcknowledged();

            if (parentTypeCustomization.element.hasAttribute(X_ANNOTATION_JSON_TYPE_PROPERTY_NAME)) {
                typePropertyName = parentTypeCustomization.element.getAttribute(X_ANNOTATION_JSON_TYPE_PROPERTY_NAME);
            }

            final JAnnotationUse annotation = annotatable.annotate(JsonTypeInfo.class);
            annotation.param("use", JsonTypeInfo.Id.NAME);
            annotation.param("include", JsonTypeInfo.As.PROPERTY);
            annotation.param("property", typePropertyName);
        }

        final CPluginCustomization subTypeCustomization =
                customizations.find(NAMESPACE_URI, ELEMENT_JSON_SUBTYPE_TYPE);
        if (subTypeCustomization != null) {
            String typeName = null;
            subTypeCustomization.markAsAcknowledged();

            if (subTypeCustomization.element.hasAttribute(X_ANNOTATION_JSON_SUBTYPE_NAME)) {
                typeName = subTypeCustomization.element.getAttribute(X_ANNOTATION_JSON_SUBTYPE_NAME);
            }

            final JAnnotatable annotatableParent = classOutline.getSuperClass().implClass;

            JAnnotationArrayMember annotationValues = null;
            for (JAnnotationUse annot : annotatableParent.annotations()) {
                if (annot.getAnnotationClass().fullName().equals(JsonSubTypes.class.getCanonicalName())) {
                    annotationValues = (JAnnotationArrayMember)annot.getAnnotationMembers().get("value");
                    break;
                }
            }
            if (annotationValues == null) {
                annotationValues = annotatableParent.annotate(JsonSubTypes.class).paramArray("value");
            }

            annotationValues.annotate(JsonSubTypes.Type.class).param("value", classOutline.implClass).param("name", typeName);
        }
    }
}
