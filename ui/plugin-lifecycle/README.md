> **NOTE**: This plugin-lifecycle has been deprecated. There is a new plugin seed project published in the [vmware-samples](https://github.com/vmware-samples/vcd-ext-samples/tree/customize-portal) repository. This vmware-sample repository is the currently preferred starting point for plugin authors and it has a few benefits over the plugin seed contained in this vcd-ext-sdk repository, including consumption of `@vcd/sdk` and `@vcd/bindings` packages from a public NPM repository, and an improved build process leveraging NPM and Webpack.


# VCD Customize Portal Plugin

## Overview
This is a plugin for configuring various parts of the vCloud Director UI portals. It currently supports managing plugins, but will soon support managing themes, and branding of the portals.

The plugin will appear as an option in the top level navigation menu of the provider portal.

## Getting Started
### Prerequisites ###
This document assumes Yarn as the package manager, as well as NodeJS 6.x or 8.x. NodeJS 10.x and 12.x has known incompatibilities.

An installation of vCloud Director version 9.1.0.2 or above is required to deploy the plugin.

### Build
```bash
git clone https://github.com/vmware/vcd-ext-sdk.git
cd ui/plugin-lifecycle

# install project dependencies
yarn

# build plugin
yarn build
```

### Install
> Note: A service provider admin account is necessary to install the plugin into vCloud Director.

> Note 2: If you are running version 9.7 or later of vCloud Director, you do **not** need to install this plugin, as it is installed by default in a 9.7 system.

#### Manual Method ####
To install the plugin manually see section "Manual Method" on page [vcd-plugin-seed](https://github.com/vmware/vcd-ext-sdk/tree/master/ui/vcd-plugin-seed)
