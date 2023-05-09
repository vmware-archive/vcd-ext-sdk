
# VMware Cloud Director Angular Plugin Builder

## Overview
The @vcd/plugin-builders package contains an Angular Builder which you can use to bundle any Angular Module in your Application in standard VMware Cloud Director UI Plugin.

- [VMware Cloud Director Angular Plugin Builder](#vmware-cloud-director-angular-plugin-builder)
	- [Overview](#overview)
	- [Documentation](#documentation)
		- [How it works](#how-it-works)
		- [Angular Builder](#angular-builder)
			- [Description](#description)
			- [Useful References:](#useful-references)
		- [Webpack](#webpack)
			- [Description](#description-1)
			- [Useful References:](#useful-references-1)
		- [PostCSS Plugins](#postcss-plugins)
			- [Description](#description-2)
			- [Useful References:](#useful-references-2)
		- [Build](#build)
	- [Usage](#usage)
	- [Contributing](#contributing)

## Documentation
### How it works
Our Plugin Builder is combination of the following things:
- Angular Builder
- Webpack
- PostCSS Plugins

We are goin to cover each piece.
### Angular Builder
#### Description
We implement our custom Angular Builder to build VMware Cloud Director UI Plugins, hence the name - Plugin Builder.

We implement it in the standard Angular documented way,
you can search for information how Custom Angular Builders are developed in the Angular documentation.

#### Useful References:
- [Angular CLI builders](https://angular.io/guide/cli-builder)
- [Angular Builders GitHub](https://github.com/just-jeb/angular-builders)


### Webpack
#### Description
We use webpack's feature `splitChunks` and `externals` to isolate the npm dependencies from your UI Plugin code, and therefore we inject in the final bundle only the source code of the UI Plugin plus custom libraries.

All npm dependencis in the `externals` list will be provided to your UI Plugin by VMware Cloud Director at runtime, this boosts the loading time of your UI Plugin a lot.

We leverage Webpack's `DefinePlugin`, to replace keywords in the final JS bundle. Most often we use to perform JS isolation in special type of UI Plguins called Hyper. Regular UI Plugins doesn't leverage the `DefinePlugin`.


#### Useful References:
- [Webpack SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)
- [Externals](https://webpack.js.org/configuration/externals/)

### PostCSS Plugins
#### Description
We have 2 types of UI Plugins:
- Regular, implemented by 3rd parties
- Hyper, this type of UI Plugins support the regular with: JS isolation, CSS isolation and more.

Now, the PostCSS Plugins are not used by the Regular UI Plugins in build time, it's used only by the Hyper ones.

We have only one PostCSS Plugin which ensures that when you load the Regular UI Plugin in the browser it doesn't look expanded or collapsed. This could happen if you based your CSS rem is based on different base than VMware Cloud Director UI.
For example you wrote your `UI Plugin with 1rem = 16px` but `Cloud Director 1rem = 24px`, in that case your UI Plugin will be `expanded`.

#### Useful References:
- [Writing a PostCSS Plugin](https://postcss.org/docs/writing-a-postcss-plugin)
### Build
```bash

git clone https://github.com/vmware/vcd-ext-sdk.git
cd ./vcd-ext-sdk/packages/angular/projects/vcd/plugin-builders
npm i
npm run build
```
## Usage

> Note: This version of the VMware Cloud Director Plugin Builder is supported by Angular 15.

1. Download the package
    ```bash
    npm i @vcd/plugin-builders@latest
    ```
2. In your `angular.json`
    ```json
    {
    	"$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    	...
    	"projects": {
    		"uiPlugin": {
    			...
    			"architect": {
    				"build": {
    					"builder": "@vcd/plugin-builders:plugin-builder",
    					"options": {
							"modulePath": "src/main/my-plugin.module.ts#MyPluginModule",
							"outputPath": "dist/",
							"index": "src/index.html",
							"main": "src/plugin.main.ts",
							"tsConfig": "tsconfig.json",
							"assets": [{
								"glob": "**/*",
								"input": "./src/public",
								"output": "/"
							}],
							"optimization": true,
							"outputHashing": "all",
							"sourceMap": false,
							"extractCss": false,
							"namedChunks": false,
							"aot": false,
							"extractLicenses": false,
							"vendorChunk": false,
							"buildOptimizer": false
    					}
    				}
    			}
    		}
    		...
    	}
    }
    ```
3. Build your UI Plugin
   	```bash
	ng build
	```
## Contributing

The vcd-ext-samples project team welcomes contributions from the community. Before you start working with vcd-ext-samples, please read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch. For more detailed information, refer to [CONTRIBUTING.md](CONTRIBUTING.md).