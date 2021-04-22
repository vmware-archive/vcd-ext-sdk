---
layout: default
title:  "Overview"
category: CARE Package Plugins
catOrder: 3
hasMore: true
order: 1
permalink: /architecture/plugins/overview
---
# Overview
CARE Package plugins allow for extending the features supported by CARE Package. Each plugin is responsible for the lifecycle of a single type of extensibility feature. CARE Package plugins are written in Javascript/Typescript and are packaged as Node Modules. Each plugin has two deliverables:
* The regular Node module, i.e. javascript file referenced by the `package.json`'s `main` property
* Deploy actions bundle, which right now is located at `./dist/deploy.js`

## Full Plugin Interface
The plugin must export an object implementing the following interface:
```typescript
...
export interface Plugin {
    name: string;
    displayName: string;
    buildActions: BuildActions;
    deployActions: DeployActions;
}
```
Full type definition file can be found here: [Plugin.d.ts](https://github.com/vmware/vcd-ext-sdk/blob/main/packages/care-package/core-def/src/Plugin.d.ts)

One thing to notice is that `BuildActions` and `DeployActions` are separated. This is needs to ensure only the DeployActions are bundled to be used by any `CARE Package Manager`.

## Deploy.js
This bundle is created using `webpack`. For details see: [webpack.config.js](https://github.com/vmware/vcd-ext-sdk/blob/main/packages/care-package/types-plugin/webpack.config.js)
The purpose of this bundle is to include only the deploy actions required so that any implementation of the `CARE Package Manager` can use the plugin. This file can also be included with the CARE Package.

# The Abstract Plugin
The following plugin can be "extended" to inherit default behavior for certain lifecycle methods:
* Build Actions
  * generate
  * pack
  * deploy
* Deploy Actions
  * deploy
