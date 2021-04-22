---
layout: default
title:  "Overview"
category: none
catOrder: 1
hasMore: true
order: 1
permalink: /architecture
---
# Architecture Overview
The purpose of this section is to provide visibility into how things work under the hood. This is especially useful to people willing to contribute to the tooling, as well as people willing to extend it.
In this section we will cover the CARE package specification and its internals, as well as how the Extensibility CLI is built.

# CARE Package

Could Director exposes different extensibility mechanisms: UI plugins, Defined Entities, API extensions, etc. Each of those has its own lifecycle and management APIs, but in the real world they play together to implement more complex use cases and be used as part of a bigger solution. This makes building, distributing and deploying such solution a challenge. To tackle this problem we introduce the Cloud ARchive for Extensions (CARE) package. It is a package which contains the deliverables to be deployed, any configuration required, as well as the information needed to ask the user for how the package should be deployed.

## Data
This is the physical representation of the CARE Package as described in the [specification]({{ site.baseurl }}/architecture/care_package/overview). It is an output of the CARE Package build process and an input of the CARE Package installation process.

## Processes
The following processes support the lifecycle of a CARE package:
* Build - produces a CARE Package
* Installation - consumes a CARE Package and takes care of installation/uninstallation of a CARE Package.
* Configuration - manages the configuration of an installed CARE Package

The lifecycle of a CARE package can be defined as follows:
![CARE Package Lifecycle Diagram]({{ site.baseurl }}/assets/images/architecture/care_lifecycle.png)
First a package must be built, then installed, after that optionally it can be configured and finally uninstalled. Upgrade can be defined as installation of the new package and uninstallation of the old package.

## Interfaces
Before we dive into  the interfaces of the CARE Package ecosystem, it is important to first define the two categories of interfaces: vertical and horizontal. It is true that we can rotate the picture and invert the terms, but let's define vertical as the interfaces needs to support a single operation within the previously defined CARE Package lifecycle, and the interfaces between the different lifecycle stages as horizontal.

### Horizontal interfaces
* Builder - the builder interface defines methods which support the Build process. It produces a package from set of inputs.
* Manager - the manager interface defines methods which support both the `Installation` and `Configuration` processes. Given a CARE package it provides means to install and configure it on a running Cloud Director instance.
* CARE Package - the package itself can contain methods used by the `Manager` to perform installation and/or configuration.

### Vertical interface
As we already mentioned there are many different types of extensibility mechanisms and to add support for all of them at the same time will be very time consuming and not very practical. On the other hand, there are use cases which require specific build, install or configure steps, which can be implemented by a solution developer, but not applicable for all solutions out there. To address this needs we introduce the CARE Package plugins, which implement all required lifecycle methods for a specific extensibility mechanism, which as defined by the specification are called elements.
The following diagram shows the interaction between the CARE Package Tools, which are implementations of the `Builder` and/or `Manager` interfaces and the CARE Package plugins:
![CARE Package Plugins Diagram]({{ site.baseurl }}/assets/images/architecture/care_package_plugins.png)
