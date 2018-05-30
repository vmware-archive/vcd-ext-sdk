/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.bindings.generator;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UncheckedIOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;

import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.util.ClassUtils;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.vmware.vcloud.bindings.generator.typescript.TypescriptEnum;
import com.vmware.vcloud.bindings.generator.typescript.TypescriptFile;

public class BindingsGenerator {
    private static final Logger LOGGER = LoggerFactory.getLogger(BindingsGenerator.class);

    private static final Set<AnnotationTypeFilter> FILTERS = new HashSet<>();
    static {
        FILTERS.add(new AnnotationTypeFilter(XmlType.class));
        FILTERS.add(new AnnotationTypeFilter(XmlEnum.class));
    };

    public static void main(String... args) {
        BindingsGenerator generator = new BindingsGenerator();
        JCommander commander = JCommander.newBuilder().programName(BindingsGenerator.class.getSimpleName()).addObject(generator).build();
        commander.parse(args);
        if (generator.help) {
            commander.usage();
            return;
        }

        generator.generate();
    }

    @Parameter(names = {"-p", "--packages"}, description = "One or more packages to scan for schema classes.", variableArity = true, required = true)
    private List<String> packages;

    @Parameter(names = {"-h", "--help"}, description = "Prints this help message", help = true)
    private boolean help;

    @Parameter(names = {"-o", "--outputDir"}, description = "A directory to output custom files to.  If none is specified, the output is streamed to standard out.")
    private File outputDir;

    @Parameter(names = {"-x", "--overwrite"}, arity = 0, description = "If the specified outputDir is not empty the generator will halt.  Adding this flag will DELETE "
            + "the content of outputDir and force the generator to continue")
    private boolean overwrite;

    private ClassPathScanningCandidateComponentProvider provider;

    private Template classTemplate;
    private Template enumTemplate;
    private Template indexTemplate;

    private BindingsGenerator() {
        provider = new ClassPathScanningCandidateComponentProvider(false) {
            @Override
            protected boolean isCandidateComponent(AnnotatedBeanDefinition beanDefinition) {
                AnnotationMetadata metadata = beanDefinition.getMetadata();
                return metadata.isIndependent() && !metadata.isInterface();
            }
        };

        LOGGER.trace("Scanning for classes with annotations {}", FILTERS);
        FILTERS.forEach(provider::addIncludeFilter);
        provider.setResourcePattern("*.class");

        VelocityEngine engine = new VelocityEngine();
        engine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        engine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        engine.init();

        this.classTemplate = engine.getTemplate("/typescript/class.ts.vm");
        this.enumTemplate = engine.getTemplate("/typescript/enum.ts.vm");
        this.indexTemplate = engine.getTemplate("/typescript/index.ts.vm");
    }

    public BindingsGenerator(final List<String> packages) {
        this();
        this.packages = packages;
    }

    public BindingsGenerator outputDir(final File outputDir) {
        this.outputDir = outputDir;
        return this;
    }

    public BindingsGenerator overwrite(boolean overwrite) {
        this.overwrite = overwrite;
        return this;
    }

    public void generate() {
        long start = System.currentTimeMillis();
        validateOutputState();
        this.packages.forEach(this::createBindingsForPackage);
        createBarrels();

        LOGGER.info("Complete in {} ms", System.currentTimeMillis() - start);
    }

    private void validateOutputState() {
        if (outputDir == null || !outputDir.exists()) {
            return;
        }

        boolean empty;
        try (Stream<Path> files = Files.list(outputDir.toPath())) {
            empty = !files.iterator().hasNext();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }

        if (empty) {
            return;
        }

        if (!empty && !overwrite) {
            LOGGER.error("Directory {} is not empty.  Aborting code generation.  To overwrite the directory, specify --overwrite option.", outputDir.getAbsolutePath());
            throw new IllegalStateException("outputDir not empty and overwrite flag not specified.");
        }

        LOGGER.info("--overwrite flag specified.  Deleting current content of {}", outputDir.getAbsolutePath());
        try {
            Files.walk(outputDir.toPath())
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private void createBindingsForPackage(final String basePackage) {
        LOGGER.info("Creating Typescript bindings for package {}", basePackage);
        List<Class<?>> classes = this.provider.findCandidateComponents(basePackage).stream()
                .map(bd -> ClassUtils.resolveClassName(bd.getBeanClassName(), null))
                .collect(Collectors.toList());

        if (classes.isEmpty()) {
            LOGGER.warn("Package {} contains no bindable classes", basePackage);
            return;
        }

        for (Class<?> clazz : classes) {
            TypescriptFile file;
            if (clazz.isEnum()) {
                file = TypescriptFile.createEnum(clazz);
            } else {
                file = TypescriptFile.createClass(clazz);
            }

            LOGGER.debug("Adding {} to package {}", file, basePackage);
            writeFile(file, basePackage);
        }
    }

    private void createBarrels() {
        Map<Path, List<String>> barrels = new HashMap<>();
        try (Stream<Path> files = Files.walk(outputDir.toPath())) {
            files.forEach(f -> {
                if (Files.isDirectory(f)) {
                    barrels.putIfAbsent(outputDir.toPath().relativize(f), new ArrayList<>());
                }

                if (f.equals(outputDir.toPath())) {
                    return;
                }

                String value;
                if (Files.isDirectory(f)) {
                    value = f.getFileName().toString().concat("/");
                } else {
                    value = f.getFileName().toString();
                    value = value.substring(0, value.lastIndexOf("."));
                }

                barrels.get(outputDir.toPath().relativize(f.getParent())).add(value);
            });
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }

        barrels.entrySet().forEach(barrel -> {
            VelocityContext context = new VelocityContext();
            context.put("_formatter", StringUtils.class);
            context.put("year", LocalDate.now().getYear());
            context.put("imports", barrel.getValue());
            try (Writer writer = getWriter("index.ts", barrel.getKey().toString())) {
                indexTemplate.merge(context, writer);
            } catch (final IOException e) {
                throw new UncheckedIOException(e);
            }
        });
    }

    private void writeFile(final TypescriptFile tsFile, final String basePackage) {
        VelocityContext context = new VelocityContext();
        context.put("_formatter", StringUtils.class);
        context.put("year", LocalDate.now().getYear());
        context.put("class", tsFile);

        Template template = (tsFile instanceof TypescriptEnum)  ? enumTemplate : classTemplate;
        try (Writer writer = getWriter(tsFile.getName() + ".ts", basePackage)) {
            template.merge(context, writer);
        } catch (final IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private Writer getWriter(final String name, final String basePackage) {
        if (outputDir == null) {
            return new BufferedWriter(new PrintWriter(System.out));
        }

        try {
            File scopedOutputDir = new File(outputDir, getRelativePackage(basePackage).replace('.', File.separatorChar) + File.separatorChar);
            scopedOutputDir.mkdirs();
            return new BufferedWriter(new FileWriter(new File(scopedOutputDir, name)));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private String getRelativePackage(final String basePackage) {
        return basePackage.replace("com.vmware.", "");
    }
}
