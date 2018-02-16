# Overview
`object-extensibility` is a collection of libraries and sample extensions that consume those libraries
to interact with the Object Extensibility feature of vCloud Director.

This repository contains several Maven-based projects.  The following libraries are available for
incorporating into new extension applications:
* object-extensibility-amqp
..* a library for interacting with AMQP exchanges
* object-extensibility-vcd
..* a library for interacting with vCloud Director's REST API

The following sample applications are also available:
* object-extensibility-app
..* the "Hello World" of extension apps asynchronously listens for messages and logs them, notification style

# Getting Started

## Building
`mvn install` from the parent POM directory will build all libraries and sample applications

## Running Hello World Extension
