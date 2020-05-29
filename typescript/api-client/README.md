
# vCloud Director Development Utilities #
A collection of Typescript libraries for quickly and easily communication with vCloud Director and development.

## Overview ##
The API client is currently made up of the following packages:

### @vcd/bindings ###
A collection of Typescript objects that represent the vCD API's requests/responses.

### @vcd/sdk ###
An Angular module that provides a REST API client with consistent handling of patterns and behaviors specific to the vCloud REST API. This module also contains various utilities and tools for things like query and filter management.

### @vcd/schematics ###
An Angular library which provides ancillary tools for plugin development.

### @vcd/plugin-builders ###
An Angular library which provides angular builders, with which you will be able to package an UI Plugin from any module in your application.

## Building ##
```bash
cd ./typescript/api-client
npm i
# To build all angular libraries
npm run build
```

## How to use it ###
### @vcd/sdk ###
```bash
# Install the package
npm i @vcd/sdk
# Setup the package
ng add @vcd/sdk
```
You will be prompted to enter:
1. Which module you want to import (`VcdSdkModule` by default)
2. Your module relative path

For more details visit `typescript/api-client/projects/vcd/sdk/README.md`

### @vcd/plugin-builders ###

> **Note:** This version of the plugin builder is supported by angular 7.3.8^.

```bash
# Install the package
npm i @vcd/plugin-builders
```
In your angular.json file create new section under your project and add the following:
```json
{
	"$schema": "./node_modules/@angular/cli/lib/config/schema.json",
	...
	"projects": {
		"your-project": {
		...
			"architect": {
				#  Note  that  the  only  thing  which  this  builder  expects  is  the  modulePath,  all  other  options  are  up  to  you.
				"your-plugin-builder-config": {
					"builder": "@vcd/plugin-builders:plugin-builder",
					"options": {
						"modulePath": "./path/to/your/module",
						"outputPath": "./path/to/your/dist/folder",
						#  The  index  is  not  really  neaded  but  have  to  stay  there  because  of  the  angular  validation.
						"index": "src/index.html",
						"main": "src/main.ts",
						"tsConfig": "src/tsconfig.app.json",
						"assets": [
							#  Include  the  paths  to  your  plugin  manifest  and  i18n  json  files  here.
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

To create plugin from your module run:
```bash
ng run `your-project`:`your-plugin-builder-config`
```

### @vcd/schematics ###
```bash
# Install the package
npm i @vcd/schematics
# Run the plugin seed schematic
# Note: only version 9.1 is supported for now
ng g @vcd/schematics:plugn-seed --name=`your_plugin_name` --vcdVersion=`9.1`
```