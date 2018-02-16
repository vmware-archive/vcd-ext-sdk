/* *********************************************************
 * api-extension-template-vcloud-director
 * Copyright (c) 2017-2018 VMware, Inc. All Rights Reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************/
package com.vmware.vcloud.object.extensibility.amqp.impl;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.xml.bind.annotation.XmlTransient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.support.converter.MarshallingMessageConverter;
import org.springframework.amqp.support.converter.MessageConversionException;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

import com.sun.xml.bind.api.JAXBRIContext;
import com.sun.xml.bind.v2.model.annotation.AbstractInlineAnnotationReaderImpl;
import com.sun.xml.bind.v2.model.annotation.AnnotationReader;
import com.sun.xml.bind.v2.model.annotation.Locatable;
import com.sun.xml.bind.v2.model.annotation.RuntimeAnnotationReader;
import com.sun.xml.bind.v2.model.annotation.RuntimeInlineAnnotationReader;

/**
 * Manages conversion of of extensibility AMQP messages. Supports conversion to and from XML
 */
public class ObjectExtensionXMLMessageConverter implements MessageConverter {

    private final Logger logger = LoggerFactory.getLogger(ObjectExtensionXMLMessageConverter.class);

    public static final String EXTENSIBILITY_AMQP_NAMESPACE = "http://www.vmware.com/vcloud/extensibility/v1.0 ";
    public static final String EXTENSIBILITY_AMQP_XSD = "/extensibility/v1.0/master.xsd";

    private MarshallingMessageConverter xmlMessageConverter;

    public ObjectExtensionXMLMessageConverter() {
        xmlMessageConverter = initXmlConverter();
    }

    private MarshallingMessageConverter initXmlConverter() {
        final Jaxb2Marshaller xmlJaxbMarshaller = new Jaxb2Marshaller();
        try {
            final Map<String, Object> jaxbConfig = new HashMap<String, Object>();
            jaxbConfig.put(JAXBRIContext.ANNOTATION_READER, new TransientAnnotationReader());
            xmlJaxbMarshaller.setJaxbContextProperties(jaxbConfig);
            xmlJaxbMarshaller.setPackagesToScan(new String[] { "com.vmware.vcloud.extensibility.platform" });
            xmlJaxbMarshaller.afterPropertiesSet();
        } catch (Exception e) {
            throw new RuntimeException("Exception initializing XML Message converter", e);

        }
        return new MarshallingMessageConverter(xmlJaxbMarshaller, xmlJaxbMarshaller);
    }

    @Override
    public Message toMessage(final Object object, final MessageProperties messageProperties)
            throws MessageConversionException {

        Objects.requireNonNull(object, "message cannot be null");
        Objects.requireNonNull(messageProperties, "message properties cannot be null");
        Objects.requireNonNull(messageProperties.getContentType(), "message content type cannot be null");

        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_XML);

        return xmlMessageConverter.toMessage(object, messageProperties);
    }

    @Override
    public Object fromMessage(final Message message) throws MessageConversionException {

        try {
            Objects.requireNonNull(message, "message cannot be null");
            Objects.requireNonNull(message.getMessageProperties(), "message properties cannot be null");
            Objects.requireNonNull(message.getMessageProperties().getContentType(), "message content type cannot be null");

            logger.info("Converting AMQP XML message:\n {}", new String(message.getBody()));
            
            final Object responseMessage = xmlMessageConverter.fromMessage(message);

            if (responseMessage != null && RuntimeException.class.isAssignableFrom(responseMessage.getClass())) {
                throw (RuntimeException) responseMessage;
            }

            return responseMessage;
        } catch (Exception e) {
            logger.error("Unexpected exception processing incoming AMQP message. Returning null", e);
            return null;
        }
    }

    /**
     * Custom {@link AnnotationReader} to annotate as fields and methods as {@link XmlTransient}.
     * This is needed to facilitate marshalling error message types to Java exceptions. TODO - add more info here
     */
    class TransientAnnotationReader extends AbstractInlineAnnotationReaderImpl<Type, Class, Field, Method> implements RuntimeAnnotationReader {
        private final RuntimeInlineAnnotationReader delegate = new RuntimeInlineAnnotationReader();
        private final Field stackTraceField;
        private final Method stackTraceMethod;
        private final Annotation xmlTransientAnnotation;
        private final Annotation[] xmlTransientAnnotationArray;

        public TransientAnnotationReader() throws NoSuchFieldException, SecurityException, NoSuchMethodException {
            this.stackTraceField = Throwable.class.getDeclaredField("stackTrace");
            this.stackTraceMethod = Throwable.class.getDeclaredMethod("getStackTrace");
            this.xmlTransientAnnotation = (XmlTransient) Proxy.newProxyInstance(ObjectExtensionXMLMessageConverter.class.getClassLoader(), new Class[] { XmlTransient.class }, new XmlTransientProxyHandler());
            this.xmlTransientAnnotationArray = new Annotation[] { xmlTransientAnnotation };
        }

        @Override
        public boolean hasClassAnnotation(Class clazz, Class<? extends Annotation> annotationType) {
            return delegate.hasClassAnnotation(clazz, annotationType);
        }

        @Override
        public <A extends Annotation> A getClassAnnotation(Class<A> annotationType, Class clazz, Locatable srcPos) {
            return delegate.getClassAnnotation(annotationType, clazz, srcPos);
        }

        @Override
        public boolean hasFieldAnnotation(Class<? extends Annotation> annotationType, Field field) {
            if (XmlTransient.class.isAssignableFrom(annotationType) && (stackTraceField.equals(field))) {
                return true;
            }
            return delegate.hasFieldAnnotation(annotationType, field);
        }

        @Override
        public <A extends Annotation> A getFieldAnnotation(Class<A> annotationType, Field field, Locatable srcPos) {
            if (XmlTransient.class.isAssignableFrom(annotationType) && stackTraceField.equals(field)) {
                return (A) xmlTransientAnnotation;
            }

            return delegate.getFieldAnnotation(annotationType, field, srcPos);
        }

        @Override
        public Annotation[] getAllFieldAnnotations(Field field, Locatable srcPos) {
            if (stackTraceField.equals(field)) {
                return xmlTransientAnnotationArray;
            }
            return delegate.getAllFieldAnnotations(field, srcPos);
        }

        @Override
        public boolean hasMethodAnnotation(Class<? extends Annotation> annotationType, Method method) {
            if (XmlTransient.class.isAssignableFrom(annotationType) && stackTraceMethod.equals(method)) {
                return true;
            }
            return delegate.hasMethodAnnotation(annotationType, method);
        }

        @Override
        @SuppressWarnings("unchecked")
        public <A extends Annotation> A getMethodAnnotation(Class<A> annotationType, Method method, Locatable srcPos) {
            if (XmlTransient.class.isAssignableFrom(annotationType) && stackTraceMethod.equals(method)) {
                return (A) xmlTransientAnnotation;
            }
            return delegate.getMethodAnnotation(annotationType, method, srcPos);
        }

        @Override
        public Annotation[] getAllMethodAnnotations(Method method, Locatable srcPos) {
            if (stackTraceMethod.equals(method)) {
                return xmlTransientAnnotationArray;
            }
            return delegate.getAllMethodAnnotations(method, srcPos);
        }

        @Override
        public <A extends Annotation> A getMethodParameterAnnotation(Class<A> annotation,
                Method method, int paramIndex, Locatable srcPos) {
            return delegate.getMethodParameterAnnotation(annotation, method, paramIndex, srcPos);
        }

        @Override
        public <A extends Annotation> A getPackageAnnotation(Class<A> a, Class clazz, Locatable srcPos) {
            return delegate.getPackageAnnotation(a, clazz, srcPos);
        }

        @Override
        public Class getClassValue(Annotation a, String name) {
            return delegate.getClassValue(a, name);
        }

        @Override
        public Class[] getClassArrayValue(Annotation a, String name) {
            return delegate.getClassArrayValue(a, name);
        }

        @Override
        protected String fullName(Method m) {
            return m.getDeclaringClass().getName() + '#' + m.getName();
        }
    }

    private static class XmlTransientProxyHandler implements InvocationHandler {

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            if (args == null || args.length == 0) {
                if (method.getName().equals("annotationType")) {
                    return XmlTransient.class;
                }
                if (method.getName().equals("toString")) {
                    return "@XmlTransient";
                }
            }
            throw new UnsupportedOperationException("@XmlTransient doesn't support method call: " + method.getName());
        }

        private static XmlTransient create() {
            return (XmlTransient) Proxy.newProxyInstance(
                    XmlTransientProxyHandler.class.getClassLoader(),
                    new Class[] { XmlTransient.class }, new XmlTransientProxyHandler());
       }
    }
}
