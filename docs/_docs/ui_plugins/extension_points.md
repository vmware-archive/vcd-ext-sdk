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

There are two main types of extension points:
- Navigation type extension point - used for registering a route along with an angular component or module contained in the UI Plugin, 
to a newly defined navigation element, in a particular Cloud Director navigation menu
- Action type extension point - used for attaching a callback function within an angular component to a newly defined action element, 
in a particular Cloud Director action menu

## Configuring extension points in a UI Plugin
The configuration of extension points happens in the `packages/uiPlugin/src/public/manifest.json` file.
To configure an extension points use the following properties:

- `urn` - must be a unique identifier for each extension point.
- `type` - used for defining the particular extension point type
- `name` - name of the extension point
- `description` - description of the extension point
- `component` - a component which will be injected for the particular extension point 
- `module` - a module which will be injected for the particular extension point
- `route` - a route segment which will be used for the injected module - **NOTE: route can be used only when module is defined**
- `render` - `after` - used to define where an action element will be rendered - **NOTE: it works only for action type extension points**. To render after a specific element please supply a selector such as `.vm-description`

**NOTE: You can either define component or module, you can't define both.**

To localize some properties you can use placeholders `"%nav.label%` which you define in `locales`

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
        "component": "VmBackupActionComponent" //component only
    },
    {
        "urn": "vmware:vcloud:vapp-action:restore",
        "type": "vapp-action",
        "name": "vApp Restore Action",
        "description": "Example of adding an action to vApps",
        "component": "VappRestoreActionComponent" //component only
    },
    {
        "urn": "vmware:vcloud:datacenter:sample",
        "type": "datacenter-overview",
        "name": "Custom Datacenters",
        "description": "Display custom information in the Datacenter Overview",
        "component": "DatacenterContainerComponent" //component or module - if module then route needed
    }, {
        "urn": "vmware:vcloud:datacenter:sample",
        "type": "navigation:datacenter:overview",
        "name": "Custom Datacenters (New type)",
        "description": "Display custom information in the Datacenter Overview",
        "component": "DatacenterContainerComponent" //component or module - if module then route needed
    }, {
        "urn": "urn:vmware:vcd:component-scope:primary-navigation",
        "type": "navigation:primary",
        "name": "Primary Navigation Extenson Point (New)",
        "description": "Example of adding Primary Navigation Plugin",
        "module": "SubnavPluginModule", //module only
        "route": "primary-plugin" //root route of the module
    }, {
        "urn": "urn:vmware:vcd:component-scope:applications",
        "type": "navigation:applications",
        "name": "Applicaton Extenson Point (New)",
        "description": "Display custom information in the Applicaton Tab",
        "component": "ApplicationComponent" //component or module - if module then route needed
    },
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-compute",
        "type": "navigation:datacenter:compute",
        "name": "Datacetner Compute Extenson Point (New)",
        "description": "Display custom information in the Datacetner -> Compute section",
        "component": "DatacenterComputeComponent" //component or module - if module then route needed
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
        "component": "DatacenterStorageComponent" //component or module - if module then route needed
    },
    {
        "urn": "vmware:vcloud:vapp:create", //page in create vapp wizard
        "type": "create-vapp",
        "name": "vApp Create Extension Point",
        "description": "Example of vApp Create Extensibility",
        "component": "VappCreateWizardExtensionPointComponent", //component only
        "render": {
            "after": ".vapp-name-extension-point" //render supports before and after, for now only after this class
        }
    },
    {
        "urn": "vmware:vcloud:vm:create", //page in create vm wizard
        "type": "create-vm",
        "name": "VM Create Extension Point",
        "description": "Example of VM Create Extensibility",
        "component": "VmCreateWizardExtensionPointComponent", //component only
        "render": {
            "after": ".vm-description" //render supports before and after, for now only after this class
        }
    }
]
{% endhighlight %}

### Vm action
This extension point is used for creating an extra action item in a the VM contextual action menu. 
For this particular extension point only a component can be defined.

{% highlight json %}
    {
        "urn": "vmware:vcloud:vm-action:actionName",
        "type": "vm-action",
        "name": "actionDisplayName",
        "description": "description",
        "component": "ComponentName"
    }
{% endhighlight %}

### VApp action
This extension point is used for creating an extra action item in a the vApp contextual action menu. 
For this particular extension point only a component can be defined.

{% highlight json %}
    {
        "urn": "vmware:vcloud:vapp-action:actionName",
        "type": "vapp-action",
        "name": "actionDisplayName",
        "description": "description",
        "component": "ComponentName"
    }
{% endhighlight %}

### Datacenter main navigation
This extension point is used for creating an extra navigation item in the Datacenter main navigation menu.
For this particular extension point either component or module can be defined. If a module is defined, a route definition 
is also required.

{% highlight json %}
    {
        "urn": "vmware:vcloud:datacenter:menuElementName",
        "type": "datacenter-overview",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

### Primary navigation
This extension point is used for creating an extra navigation item in the Primary navigation menu.
For this particular extension point only module can be defined. Therefor a route definition is also required.

{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:primary-navigation:menuElementName",
        "type": "navigation:primary",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "module": "moduleName", //module only
        "route": "routeName" //root route of the module
    }
{% endhighlight %}

### Applications navigation
This extension point is used for creating an extra navigation item in the Applications navigation menu.
For this particular extension point either component or module can be defined. If a module is defined, a route definition 
is also required.

{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:applications:menuElementName",
        "type": "navigation:applications",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

### Datacenter extension points
For these particular extension points either component or module can be defined. If a module is defined, a route definition 
is also required.

#### Compute
This extension point is used for creating an extra navigation item in the Datacenter compute navigation menu.

{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-compute:menuElementName",
        "type": "navigation:datacenter:compute",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

#### Network
This extension point is used for creating an extra navigation item in the Datacenter network navigation menu.

{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-network:menuElementName",
        "type": "navigation:datacenter:network",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

#### Storage
This extension point is used for creating an extra navigation item in the Datacenter storage navigation menu.

{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-storage:menuElementName",
        "type": "navigation:datacenter:storage",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

### Vapp Create
This extension point is used for creating an extra page in all create vApp wizards.
For this particular extension point only a component can be defined.

{% highlight json %}
    {
        "urn": "vmware:vcloud:vapp:create", //page in create vapp wizard
        "type": "create-vapp",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //component only
        "render": {
            "after": ".vapp-name-extension-point" //for now this is the only option
        }
    }
{% endhighlight %}

### VM Create
This extension point is used for creating an extra page in all create VM wizards.
For this particular extension point only a component can be defined.
{% highlight json %}
    {
        "urn": "vmware:vcloud:vm:create", //page in create vm wizard
        "type": "create-vm",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //component only
        "render": {
            "after": ".vm-description" //for now this is the only option
        }
    }
{% endhighlight %}

[vcd-ext-samples-showcase]: https://www.vmware.com/products/cloud-director.html

