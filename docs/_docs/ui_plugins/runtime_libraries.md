---
layout: default
title:  "Runtime libraries"
category: UI Plugins
description: "Runtime libraries"
catOrder: 3
order: 4
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/runtime_libraries
---
# Runtime libraries
For a given UI plugin, one can make use of the `Runtime Dependency Management` feature. This feature, can basically allow 
splitting the UI plugin and its dependencies into separate libraries.

Each library has name, version, scope and location (location is automatically populated but if you want you can specify it on your own). 
The name and the version are standard as in your package.json file.
The `scope` instructs Cloud Director instance what to do with your dependencies:
- External - this dependency will be provided by the vCloud Director Core UI.
- Bundled - your dependency will be bundled and deployed together with the UI Plugin. They will also be shared with other UI 
plugins, so that if versions match, they can make use of the same library, thus avoid library duplicates. 

## Enabling UI Runtime Dependency Management
- Locate the `angular.json` file in the root of the UI Plugin. Find the `architect->build->options` section and add the `librariesConfig` as such:

{% highlight json %}
"options": {
    "librariesConfig": {
        "libName": {
            "version": "x.x.x",
            "scope": "external or bundled"
          },
          ...
    }
}
{% endhighlight %}

- In the plugin builder's options object add "enableRuntimeDependecyManagement" : true
- Set the `optimization` property in your to false.
