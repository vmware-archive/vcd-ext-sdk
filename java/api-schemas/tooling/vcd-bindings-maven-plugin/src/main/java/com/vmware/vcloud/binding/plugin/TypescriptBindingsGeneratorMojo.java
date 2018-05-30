/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * ***************************************************************************/
package com.vmware.vcloud.binding.plugin;

import java.io.File;
import java.util.List;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;

import com.vmware.vcloud.bindings.generator.BindingsGenerator;

@Mojo(name = "generate-typescript")
public class TypescriptBindingsGeneratorMojo extends AbstractMojo {
    @Parameter(defaultValue = "${project.build.directory}/generated-typescript-bindings")
    private File outputDirectory;

    @Parameter(required = true)
    private List<String> packages;

    @Parameter(defaultValue = "true")
    private boolean overwrite;

    public void execute() throws MojoExecutionException {
        getLog().info("Generating bindings into " + outputDirectory.getAbsolutePath());
        new BindingsGenerator(packages)
            .outputDir(outputDirectory)
            .overwrite(overwrite)
            .generate();
    }
}
