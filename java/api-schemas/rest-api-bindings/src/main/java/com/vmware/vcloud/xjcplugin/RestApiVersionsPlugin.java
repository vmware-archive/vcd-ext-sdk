/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/

package com.vmware.vcloud.xjcplugin;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.xml.sax.ErrorHandler;
import org.xml.sax.Locator;

import com.sun.codemodel.JAnnotatable;
import com.sun.codemodel.JAnnotationUse;
import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JDocComment;
import com.sun.codemodel.JEnumConstant;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JExpression;
import com.sun.codemodel.JFieldVar;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.tools.xjc.BadCommandLineException;
import com.sun.tools.xjc.Options;
import com.sun.tools.xjc.Plugin;
import com.sun.tools.xjc.model.CCustomizations;
import com.sun.tools.xjc.model.CElementInfo;
import com.sun.tools.xjc.model.CPluginCustomization;
import com.sun.tools.xjc.outline.ClassOutline;
import com.sun.tools.xjc.outline.ElementOutline;
import com.sun.tools.xjc.outline.EnumConstantOutline;
import com.sun.tools.xjc.outline.EnumOutline;
import com.sun.tools.xjc.outline.FieldOutline;
import com.sun.tools.xjc.outline.Outline;
import com.vmware.vcloud.api.annotation.ContentType;
import com.vmware.vcloud.api.annotation.Supported;
import com.vmware.vcloud.api.rest.version.ApiVersion;

import org.apache.commons.lang3.StringUtils;
import org.jvnet.jaxb2_commons.util.CustomizationUtils;
import org.jvnet.jaxb2_commons.util.FieldAccessorUtils;

/**
 * <code>RestApiVersionsPlugin</code> is a plug-in for the JAXB's XJC code
 * generator. It adds {@link Supported} annotations to the generated JAXB
 * classes, fields, elements, enums, and enum constants.
 * <p>
 * To activate it, add the following parameters to the XJC command line:<br>
 *
 * <pre>
 *   -enable -Xrest-api [<i>default-version</i>]
 * </pre>
 *
 * If <i>default-version</i> is not present "1.5" will be assumed.
 * </p>
 * <p>
 * To specify annotation values for specific element, you need to add the
 * following to the XSD:
 *
 * <pre>
 * &lt;xs:appinfo>
 *     &lt;meta:version added-in="1.5" removed-in="2.0"/>
 * &lt;/xs:appinfo>
 * </pre>
 *
 * If {@code added-in} is missing, the {@code default-version} will be used.<BR>
 * If {@code removed-in} is present, the usages will also be marked as deprecated.<BR>
 * If {@code removed-in} is missing, it won't be included in the generated
 * annotation either.
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
 * </p>
 * <p>
 * The plug-in also supports the content-type annotation:
 * <pre>
 * &lt;xs:appinfo>
 *     &lt;meta:content-type>application/vnd.vmware.vcloud.vApp&lt;/meta:content-type>
 * &lt;/xs:appinfo>
 * </pre>
 * which adds the {@link ContentType} annotation to the generated java class.
 * </p>
 * <p>
 * Lastly, the plugin will try to include the name of the source {@code .xsd} file
 * and the approximate line and column numbers in the class javadoc
 * </p>
 */
public class RestApiVersionsPlugin extends Plugin {

    private static final String X_ANNOTATION_ADDED_IN = "added-in";
    private static final String X_ANNOTATION_REMOVED_IN = "removed-in";
    private static final String J_ANNOTATION_ADDED_IN = "addedIn";
    private static final String J_ANNOTATION_REMOVED_IN = "removedIn";
    private static final String NAMESPACE_URI = "http://www.vmware.com/vcloud/meta";
    private static final String ELEMENT_VERSION = "version";
    private static final String ELEMENT_CONTENT_TYPE = "content-type";
    private static final String PLUGIN_OPTION = "Xrest-api";
    private static final String CONTENT_TYPE_CONST = "CONTENT_TYPE";
    private String version = "1.5";

    @Override
    public String getOptionName() {
        return PLUGIN_OPTION;
    }

    @Override
    public int parseArgument(Options opt, String[] args, int i) throws BadCommandLineException, IOException {
        final String rxVersion = "\\w+(\\.\\d+)*";

        final int j = i + 1;
        if (j < args.length && args[j].matches(rxVersion)) {
            version = args[j];
            return 2;
        }

        return 1;
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
                && (ELEMENT_VERSION.equals(localName) || ELEMENT_CONTENT_TYPE.equals(localName));
    }

    @Override
    public String getUsage() {
        return "  -" + PLUGIN_OPTION + " [default-version]"
                + ": enables the plugin and sets the default version to be used as \"added-in\" elements.\n";
    }

    @Override
    public boolean run(Outline outline, Options options, ErrorHandler errorHandler) {
        for (CElementInfo elementInfo : outline.getModel().getAllElements()) {
            ElementOutline elementOutline = outline.getElement(elementInfo);
            if (elementOutline != null) {
                processElementOutline(elementOutline, errorHandler);
            }
        }

        for (ClassOutline classOutline : outline.getClasses()) {
            processClassOutline(classOutline, errorHandler);
        }

        for (EnumOutline enumOutline : outline.getEnums()) {
            processEnumOutline(enumOutline, errorHandler);
        }

        return true;
    }

    /**
     * Annotates {@link ElementOutline}.
     *
     * @param elementOutline
     * @param errorHandler
     */
    private void processElementOutline(ElementOutline elementOutline, ErrorHandler errorHandler) {
        CCustomizations customizations = CustomizationUtils.getCustomizations(elementOutline);
        addSupportedAnnotation(elementOutline.implClass, customizations);
        addSourceLocationComment(elementOutline.implClass, customizations);
    }

    /**
     * Annotates {@link ClassOutline}.
     *
     * @param classOutline
     * @param errorHandler
     */
    private void processClassOutline(ClassOutline classOutline, ErrorHandler errorHandler) {
        CCustomizations customizations = CustomizationUtils.getCustomizations(classOutline);
        JDefinedClass implClass = classOutline.implClass;

        addSupportedAnnotation(implClass, customizations);
        addContentTypeAnnotation(implClass, customizations);
        addSourceLocationComment(implClass, customizations);

        for (FieldOutline fieldOutline : classOutline.getDeclaredFields()) {
            processFieldOutline(fieldOutline, errorHandler);
        }
    }

    /**
     * Annotates {@link FieldOutline}.
     *
     * @param fieldOutline
     * @param errorHandler
     */
    private void processFieldOutline(FieldOutline fieldOutline, ErrorHandler errorHandler) {
        CCustomizations customizations = CustomizationUtils.getCustomizations(fieldOutline);
        addSupportedAnnotation(FieldAccessorUtils.field(fieldOutline), customizations);
        addSupportedAnnotation(FieldAccessorUtils.getter(fieldOutline), customizations);
        addSupportedAnnotation(FieldAccessorUtils.setter(fieldOutline), customizations);
    }

    /**
     * Annotates {@link EnumOutline}.
     *
     * @param enumOutline
     * @param errorHandler
     */
    private void processEnumOutline(EnumOutline enumOutline, ErrorHandler errorHandler) {
        CCustomizations customizations = CustomizationUtils.getCustomizations(enumOutline);
        addSupportedAnnotation(enumOutline.clazz, customizations);
        addSourceLocationComment(enumOutline.clazz, customizations);

        for (EnumConstantOutline enumConstantOutline : enumOutline.constants) {
            processEnumConstantOutline(enumConstantOutline, errorHandler);
        }
    }

    /**
     * Annotates {@link EnumConstantOutline}.
     *
     * @param enumConstantOutline
     * @param errorHandler
     */
    private void processEnumConstantOutline(EnumConstantOutline enumConstantOutline, ErrorHandler errorHandler) {
        CCustomizations customizations = CustomizationUtils.getCustomizations(enumConstantOutline);
        addSupportedAnnotation(enumConstantOutline.constRef, customizations);
    }

    /**
     * This method adds {@link Supported} annotation to the given element. It reads the "added-in"
     * and "removed-in" values from the customizations if present. Otherwise, it uses the default
     * {@link #version} for "added-in" and leaves "removed-in" empty.
     * <P>
     * If "removed-in" is present, @{@link Deprecated} annotation and the {@code @deprecated} doclet
     * are also added.
     *
     * @param annotatable
     *            the element which will be annotated
     * @param customizations
     *            schema customizations for this element
     */
    private void addSupportedAnnotation(JAnnotatable annotatable, CCustomizations customizations) {
        if (annotatable == null) {
            return;
        }
        String addedIn = version;
        String removedIn = null;

        CPluginCustomization customization = customizations.find(NAMESPACE_URI, ELEMENT_VERSION);

        if (customization != null) {
            customization.markAsAcknowledged();

            if (customization.element.hasAttribute(X_ANNOTATION_ADDED_IN)) {
                addedIn = customization.element.getAttribute(X_ANNOTATION_ADDED_IN);
            }
            if (customization.element.hasAttribute(X_ANNOTATION_REMOVED_IN)) {
                removedIn = customization.element.getAttribute(X_ANNOTATION_REMOVED_IN);
            }
        }

        // Let's validate the API version strings first
        try {
            ApiVersion.fromValue(addedIn);
            if (removedIn != null) {
                ApiVersion.fromValue(removedIn);
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Double check API version string on "
                    + customization.locator.getSystemId() + ":"
                    + customization.locator.getLineNumber() + "", e);
        }

        JAnnotationUse annotation = annotatable.annotate(Supported.class);
        annotation.param(J_ANNOTATION_ADDED_IN, addedIn);
        if (removedIn == null) {
            return;
        }

        annotation.param(J_ANNOTATION_REMOVED_IN, removedIn);
        annotatable.annotate(Deprecated.class);
        final JDocComment javadoc;
        final String elementType;
        if (annotatable instanceof JMethod) {
            javadoc = ((JMethod) annotatable).javadoc();
        } else if (annotatable instanceof JFieldVar) {
            javadoc = ((JFieldVar) annotatable).javadoc();
        } else if (annotatable instanceof JDefinedClass) {
            javadoc = ((JDefinedClass) annotatable).javadoc();
        } else if (annotatable instanceof JEnumConstant) {
            javadoc = ((JMethod) annotatable).javadoc();
        } else {
            return;
        }

        final String deprecatedCommentMessage = "Removed since REST version " + removedIn;
        javadoc.addDeprecated().append(deprecatedCommentMessage);
    }


    /**
     * This method adds {@link ContentType} annotation and a CONTENT TYPE
     * constant of type "public static final String" to the JAXB generated Java
     * class. It reads the "meta:content-type" annotation element in the schema
     * and adds a corresponding Java annotation if not empty.
     *
     * @param implClass the element which will be annotated
     * @param customizations schema customizations for this element
     */
    private void addContentTypeAnnotation(JDefinedClass implClass, CCustomizations customizations) {
        if (implClass == null) {
            return;
        }

        CPluginCustomization customization = customizations.find(NAMESPACE_URI, ELEMENT_CONTENT_TYPE);

        if (customization == null) {
            return;
        }

        customization.markAsAcknowledged();

        String contentType = customization.element.getTextContent();
        if (contentType != null) {
            JAnnotationUse annotation = implClass.annotate(ContentType.class);
            annotation.param("value", contentType.trim());

            final JCodeModel codeModel = implClass.owner();
            JExpression contentTypeConst = JExpr.lit(contentType);
            @SuppressWarnings("unused")
            JFieldVar contentTypeField =
                    implClass.field(JMod.PUBLIC | JMod.STATIC | JMod.FINAL,
                            codeModel.ref(String.class), CONTENT_TYPE_CONST, contentTypeConst);
        }
    }

    /**
     * This method appends the source file and the approximate line and column numbers to the class
     * javadoc
     *
     * @param implClass
     *            the class whose comment will be appended.
     * @param customizations
     *            schema customizations for this element @
     */
    private void addSourceLocationComment(JDefinedClass implClass, CCustomizations customizations) {
        if (implClass == null) {
            return;
        }

        CPluginCustomization customization = customizations.find(NAMESPACE_URI, ELEMENT_CONTENT_TYPE);

        if (customization == null) {
            return;
        }
        customization.markAsAcknowledged();

        final Locator locator = customization.locator;

        final String source = StringUtils.defaultString(locator.getSystemId());
        final String filename = StringUtils.substringAfterLast(source, "/");

        final int lineNumber = locator.getLineNumber();
        final int columnNumber = locator.getColumnNumber();

        implClass.javadoc()
                .append(System.lineSeparator())
                .append("<p>")
                .append(System.lineSeparator())
                .append(MessageFormat.format("Schema file: {0}<br>{1}Approximate line and column {2,number,#}:{3,number,#}",
                        filename, System.lineSeparator(), lineNumber, columnNumber));
    }
}
