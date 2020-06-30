# vCloud Director Angular Plugin Builder

## Overview
The @vcd/plugin-builders package contains an angular builder which you can use to bundle any module in your app in standard vCloud Director UI Plugin.  

## How to use it?

> **Note:** This version of the plugin builder is supported by angular 6.1.0.

1. Download the package
    ```bash
    npm i @vcd/plugin-builders
    ```
2. In your `angular.json` file or you can run `ng add @vcd/plugin-builders --projectName=cloud-director-container`
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

## For UI Plugins with Incremental Loading allowed
1. Download the package
    ```bash
    npm i @vcd/plugin-builders
    ```
2. Run `ng add @vcd/plugin-builders --projectName=cloud-director-container`
3. Open your `angular.json`
4. Find the config, `Ctrl + F` "builder-config-example"
5. If you want to split your plugin and its dependencies into chunks you have to add `librariesConfig` in your plugin builder options object. Each library has name, version, scope and locaton (location is automatically populated but if you want you can specify it on your own.). The name and the version are standard as in your package.json file, scope on other hand tells to vCloud Director Core UI what to do with your dependecies:
    - Provided - this dependecy will be provided by the vCloud Director Core UI.
    - Runtime - your dependecy will be shared with other plugins which use the same version of it.
    - Self - no matter what vCloud Director Core UI will load your your library and will not share it with any other plugin in the application.
    ```json
    "options": {
        "librariesConfig": {
            "libName": {
                "version": "x.x.x",
                "scope": "provided | runtime | self"
              },
              ...
        }
    }
    ```
6. If you want to instruct which dependecies are external for your plugin (AMD Module) you can pass `externalLibs` in your options. By adding this option you are instruction vCloud Director Core UI to provide you his own dependecies which match your selector. For example vCloud Director 10.2 is using @clr/angulra@3.1.1, your plugin will receive that version.
    ```json
    "options": {
        "externalLibs": [
            "@clr/angular"
        ]
    }
    ```
7. Can disable the default `externalLibs` by passing `ignoreDefaultExternals` in your options.
8. In the plugin builder's `options` object add `"vcdVersion": "10.2"` to enable the functionality described above.


## Contributing

The vcd-ext-samples project team welcomes contributions from the community. Before you start working with vcd-ext-samples, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).