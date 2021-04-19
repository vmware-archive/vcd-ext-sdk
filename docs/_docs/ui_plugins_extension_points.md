---
layout: default
title:  "Extension points"
category: UI Plugins
description: "Extension points in UI Plugins"
catOrder: 3
order: 3
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/extension_points
---
# Extension points
An extension point essentially is a Cloud Director predefined global or contextual navigation/menu placeholder, 
which a UI plugin will use to attach itself to and be used for navigation/plugin initialization. 
There is a list of extension points, one can pick from.

## Configuring extension points in a UI Plugin
The configuration of extension points happens in the packages/uiPlugin/src/public/manifest.json file.
{% highlight json %}
{
    ...
    "extensionPoints": [
        {
            "urn": "urn:vmware:vcd:component-scope:primary-navigation",
            "type": "navigation:primary",
            "name": "%nav.label%",
            "description": "%nav.description%",
            "module": "GettingStartedPluginModule",
            "route": "GettingStarted"
        }
    ],
    "locales": {
        "en": {
            "nav.label": "GettingStarted",
            "nav.description": "A basic plugin project"
        }
    }
}
{% endhighlight %}

## Available extension points
The available extension points are demonstrated in the [Showcase plugin][vcd-ext-samples-showcase]
{% highlight json %}
[   
    {
        "urn": "vmware:vcloud:vm-action:backup",
        "type": "vm-action",
        "name": "VM Backup Action",
        "description": "Example of adding an action to VMs",
        "component": "VmBackupActionComponent"
    },
    {
        "urn": "vmware:vcloud:vapp-action:restore",
        "type": "vapp-action",
        "name": "vApp Restore Action",
        "description": "Example of adding an action to vApps",
        "component": "VappRestoreActionComponent"
    },
    {
        "urn": "vmware:vcloud:datacenter:sample",
        "type": "datacenter-overview",
        "name": "Custom Datacenters",
        "description": "Display custom information in the Datacenter Overview",
        "component": "DatacenterContainerComponent"
    }, {
        "urn": "vmware:vcloud:datacenter:sample",
        "type": "navigation:datacenter:overview",
        "name": "Custom Datacenters (New type)",
        "description": "Display custom information in the Datacenter Overview",
        "component": "DatacenterContainerComponent"
    }, {
        "urn": "urn:vmware:vcd:component-scope:primary-navigation",
        "type": "navigation:primary",
        "name": "Primary Navigation Extenson Point (New)",
        "description": "Example of adding Primary Navigation Plugin",
        "module": "SubnavPluginModule",
        "route": "primary-plugin"
    }, {
        "urn": "urn:vmware:vcd:component-scope:applications",
        "type": "navigation:applications",
        "name": "Applicaton Extenson Point (New)",
        "description": "Display custom information in the Applicaton Tab",
        "component": "ApplicationComponent"
    },
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-compute",
        "type": "navigation:datacenter:compute",
        "name": "Datacetner Compute Extenson Point (New)",
        "description": "Display custom information in the Datacetner -> Compute section",
        "component": "DatacenterComputeComponent"
    },
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-network",
        "type": "navigation:datacenter:network",
        "name": "Datacetner Network Extenson Point (New)",
        "description": "Display custom information in the Datacetner -> Network section",
        "component": "DatacenterNetworkComponent"
    },
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-storage",
        "type": "navigation:datacenter:storage",
        "name": "Datacetner Storage Extenson Point (New)",
        "description": "Display custom information in the Datacetner -> Storage section",
        "component": "DatacenterStorageComponent"
    },
    {
        "urn": "vmware:vcloud:vapp:create",
        "type": "create-vapp",
        "name": "vApp Create Extension Point",
        "description": "Example of vApp Create Extensibility",
        "component": "VappCreateWizardExtensionPointComponent",
        "run": "after", 
        "render": {
            "after": ".vapp-name-extension-point"
        }
    },
    {
        "urn": "vmware:vcloud:vm:create",
        "type": "create-vm",
        "name": "VM Create Extension Point",
        "description": "Example of VM Create Extensibility",
        "component": "VmCreateWizardExtensionPointComponent",
        "run": "after",
        "render": {
            "after": ".vm-description"
        }
    }
]
{% endhighlight %}

[vcd-ext-samples-showcase]: https://www.vmware.com/products/cloud-director.html

