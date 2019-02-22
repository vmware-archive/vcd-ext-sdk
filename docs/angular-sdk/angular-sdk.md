---
layout: default
title: "@vcd/sdk"
nav_order: 2
has_children: true
permalink: /docs/angular-sdk
---

# @vcd/sdk
The @vcd/sdk library (along with the @vcd/bindings library) is recommended for authoring plugins.
{: .fs-6 .fw-300 }

The @vcd/sdk provides several convenient utilities and services that significantly reduce the overall size (lines of code) and complexity of a plugin. Additionally, the SDK can insulate the plugin code from some of the compatibility differences between versions of vCloud Director. For example, by leveraging the @vcd/sdk, the Plugin Seed Project works in versions 9.1.0.2, 9.5.x, and 9.7.x without modification, despite the fact that those versions use different major versions of both Clarity and Angular.
{: .fs-5 .fw-300 }
