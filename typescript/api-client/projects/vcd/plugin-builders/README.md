
# vCloud Director Angular Plugin Builder

## Overview
The @vcd/plugin-builders package contains an angular builder which you can use to bundle any module in your app in standard vCloud Director UI Plugin.  

## How to use it?

> **Note:** This version of the plugin builder is supported by angular 7.3.8^.

1. Download the package
```bash
npm i @vcd/plugin-builders
```
2. In your `angular.json` file
```json
{
	"$schema": "./node_modules/@angular/cli/lib/config/schema.json",
	...
	"projects": {
		"your-project": {
			...
			"architect": {
				# Note that the only thing which this builder expects is the modulePath, all other options are up to you.
				"your-plugin-builder-config": {
					"builder": "@vcd/plugin-builders:plugin-builder",
					"options": {
					"modulePath": "./path/to/your/module",
					"outputPath": "./path/to/your/dist/folder",
					# The index is not really neaded but have to stay there because of the angular validation.
					"index": "src/index.html",
					"main": "src/main.ts",
					"tsConfig": "src/tsconfig.app.json",
					"assets": [
						# Include the paths to your plugin manifest and i18n json files here.
					],
					"optimization": true,
					"outputHashing": "none",
					"sourceMap": false,
					"extractCss": true,
					"namedChunks": false,
					"aot": true,
					"extractLicenses": true,
					"vendorChunk": false,
					"buildOptimizer": true
					}
				}
			}
		}
		...
	}
}
```
3. Run the builder through ng cli
```bash
ng run your-project:your-plugin-builder-config
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