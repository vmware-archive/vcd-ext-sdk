---
layout: default
title:  "Extensibility CLI"
category: none2
catOrder: 4
hasMore: true
order: 1
permalink: /architecture/extensibility_cli
---
# Extensibility CLI

The Extensibility CLI `vcd-ext` is the main entry point for creating, packaging and deploying solutions for Cloud Director. It is an implementation of the [CARE Package specification]({{ site.baseurl }}/architecture/care_package/overview).

## High-level Design
The following diagram shows the structure of the CLI NPM modules.
![CLI High-level Diagram]({{ site.baseurl }}/assets/images/architecture/vcd-ext-high-level.png)

## Components

### CLI
The `vcd-ext` CLI provides module exposes CARE package and Cloud Director connection related commands. These commands work together to achieve more high-level development or administration use cases. As you can see on the high-level design diagram, CARE package related commands are delegated to the CARE Package module. Cloud Director connection related commands are delegated to the Node Client library.

### CARE Package
The CARE package module is both a Builder and a Manager, which means it allows users to both build a package and management the deployment of a package.

### Plugin Definition
This module exists to decouple the CARE package module from the plugins. The CARE package module works against the interfaces defined by the Plugin definition module. Plugins on the other hand have to implement the plugin definition.

### Node Client
Node client provides a mean to manage Cloud Director API connection, as well as creating different type of clients: OpenAPI, MQTT, etc.