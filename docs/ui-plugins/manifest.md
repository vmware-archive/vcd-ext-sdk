---
layout: default
title: manifest.json
parent: UI Plugins
nav_order: 2
---

# manifest.json

The manifest.json allows a plugin author to define metadata about the plugin that will identify the plugin to a vCloud Director administrator and document its intended usage.
{: .fs-6 .fw-300 }

---

Refer to the Plugin Seed Project's [manifest.json](https://github.com/vmwaresamples/vcd-ext-samples/blob/plugin-seed-9.1/src/public/manifest.json) file as an example.

## Plugin Identification
```json
{
    "urn": "vmware:vcloud:plugin:seed",
    "name": "Simple plugin",
    "version": "1.0.0",
    "description": "An example plugin.",
    "vendor": "VMware",
    "license": "Copyright (C) VMware 2017-2019.  All rights reserved.",
    "link": "http://www.vmware.com/support"
}
```

| Field | Description |
| ----- | ----------- |
| urn | a unique URN-style identifier for the plugin |
| name | a human readable name for the plugin |
| description | a human readable description for the plugin |
| vendor | a human readble plugin vendor |
| license | license information for plugin: full name, license text, SPDX identifier, or other representation |
| link | URL to supporting content for the plugin |

## Plugin Usage
```json
{
    "containerVersion": "9.1.0",
    "scope": ["service-provider", "tenant"],
    "module": "SimplePluginModule",
    "route": "plugin"
}
```

| Field | Description |
| ----- | ----------- |
| containerVersion | the version of vCD required for this plugin (leave at `9.1.0`) |
| scope | indicator to a vCD provider which portals are intended to leverage this plugin (values: `["tenant" | "service-provider"]`) |
| module | the name of the main exported Angular module to be loaded dynamically by vCD |
| route | a top level URL route that the module can use to register child routes under |