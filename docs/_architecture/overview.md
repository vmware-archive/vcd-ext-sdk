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