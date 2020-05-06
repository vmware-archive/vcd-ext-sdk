
# @vcd/schematics
## Overview
The @vcd/schematics package provides angular schematics to ease and speed up the development process of your plugin.

## How to use it? 
```bash
# Download the package
npm i @vcd/schematics
# Generate new plugin
# Only version 9.1 is supported for now
ng g @vcd/schematics:plugin-seed --name=`you_plugin_name` --vcdVersion=`9.1`
```

## Build

```bash
git clone https://github.com/vmware/vcd-ext-sdk.git
cd vcd-ext-sdk/typescript/api-client
# install project dependencies
npm i
# build libraries
npm run build

```
## Contributing
The vcd-ext-samples project team welcomes contributions from the community. Before you start working with vcd-ext-samples, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).