# VCD UI Plugin Seed #
This is a seed project for building plugins for the vCloud Director UI using Angular 4 and [Clarity](https://github.com/vmware/clarity).

- [Overview](#overview)
- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Build](#build)
  * [Install](#install)
- [Anatomy of a Plugin](#anatomy-of-a-plugin)
  * [package.json](#packagejson)
  * [src/public/manifest.json](#src-public-manifestjson)
  * [src/public/i18n.json](#src-public-i18njson)
  * [Module and Routing](#module-and-routing)
  * [Components](#components)
    + [stub.component.ts](#stubcomponentts)
    + [stub.component.html](#stubcomponenthtml)
    + [stub.component.scss](#stubcomponentscss)


## Overview ##
The vCloud Director UI plugin system allows for integration of custom modules directly into the context of a running vCD UI.  By leveraging the plugin registration process that is built into vCD, service providers can dictate whether the plugins should be available to the provider portal or to the tenant portal, and can additionally specify exactly which tenants have access to a plugin.  This allows for a wide range of extensibility and integration within the UI, and offers the potential to monetize that functionality with very little overhead.

Currently, the only supported extension point is in the top level navigation.  However a strong internal strategy for pluggability ensures that future releases of vCloud Director will offer significant additions to the number and scope of extension points.

## Getting Started ##
This seed project works with version 9.1.0 of vCloud Director.

### Prerequisites ###
It is recommended that developers be familiar with Angular 4 coding (including modules and component resolution), and have the appropriate tooling installed.  This document assumes Yarn as the package manager.

An installation of vCloud Director version 9.1.0 is required to test the plugin.

### Build ###
```bash
git clone https://github.com/vmware/vcd-ext-sdk.git
cd vcd-ext-sdk/ui/vcd-plugin-seed

# install project dependencies
yarn

# build plugin
yarn run build
```

At this point, there will be a `plugin.zip` in the `dist/` folder.

### Install ###
A service provider admin account is necessary to install the plugin into vCloud Director.  There is currently no UI to manage plugins, so the vCD API will be used for the install. `SERVER` in the following example refers to the server endpoint of the vCD installation, and `TOKEN` is the `x-vcloud-authorization` header value returned by the initial session creation request.
```bash
# create a session for sys admin user
SERVER="vcloud.example.com" curl --header 'Accept: application/*+xml;version=30.0' --insecure --basic --data '' --user 'administrator@System:pa$$w0rd' --verbose https://$SERVER/api/sessions

# register the plugin, providing the same values as in the manifest.json
SERVER="vcloud.example.com" TOKEN="c2f4258224ce4489b4e4474e4e34db15" curl --header 'Accept: application/json' --header 'Content-Type: application/json' --header "x-vcloud-authorization: $TOKEN" --insecure --verbose https://$SERVER/cloudapi/extensions/ui --data '{"pluginName": "Stub plugin", "vendor": "VMware", "description": "", "version": "1.0.0", "license": "BSD-2", "link": "http://vcloud.example.com", "provider_scoped": true, "enabled": true}'

# enable upload on the newly registered plugin (endpoint is in the Location header of previous response)
# size is the plugin.zip's size in KB
SERVER="vcloud.example.com" TOKEN="c2f4258224ce4489b4e4474e4e34db15" PLUGIN="urn:vcloud:uiPlugin:1e634a62-a98a-46c0-b9dd-7e2c5a9e8688" curl --header 'Accept: application/json' --header 'Content-Type: application/json' --header "x-vcloud-authorization: $TOKEN" --insecure --verbose https://$SERVER/cloudapi/extensions/ui/$PLUGIN/plugin --data '{"fileName": "plugin.zip", "size": 56623}'

# Upload plugin.zip to vCloud Director
# upload path is in the Link response header of the previous call
SERVER="vcloud.example.com" TOKEN="c2f4258224ce4489b4e4474e4e34db15" curl --header 'Content-Type: application/zip' --header "x-vcloud-authorization: $TOKEN" --insecure --verbose https://$SERVER/transfer/19d7fafd-6670-4c2a-983f-0b3a49725d2e/plugin.zip --data-binary @dist/plugin.zip

```

After completing the above sequence of calls, the sample plugin will be available from the primary navigation menu of vCloud Director's Provider Portal.

## Anatomy of a Plugin ##
### package.json ###
The package.json file equates to a manifest about the application; its modules, dependencies, commands, etc.  The things that can be customized in this file include  the `name`, `version`, `description`, and `license` fields.  Additional dependecies can be included as needed, but the existing set of dependencies should not be modified, especially the Clarity and Angular dependencies which ensure compatibility with vCloud Director.

### src/public/manifest.json ###
This manifest describes your plugin to the vCD UI.  Here are the fields and their meanings:

| Field | Description |
| ----- | ----------- |
| urn | a unique URN-style identifier for the plugin |
| vendor | a human readble plugin vendor |
| name | a human readable name for the plugin |
| link | URL to supporting content for the plugin |
| description | a human readable description for the plugin |
| license | license information for plugin: full name, license text, SPDX identifier, or other representation |
| module | the name of the main exported Angular module to be loaded dynamically by vCD |
| route | a top level URL route that the module can use to register child routes under |
| containerVersion | the version of vCD required for this plugin (leave at `9.1.0`) |
| scope* | indicator to the vCD UI of which portals should display this plugin (values: `["tenant" | "service-provider"]`) |
| permissions** | leave as `[]` |
\* deprecated  
\** not in use

### src/public/i18n.json ###
This represents a JSON-formatted message bundle for providing internationalized data to the plugin.
```json
{
    "en": {
        "nav.stub": "Stub Module",
        "nav.stub.description": "The SDK test module",
        "tos.title": "Terms of Service",
        // ...
    }
}
```

The `nameCode` and the `descriptionCode` referenced in the Module (explained in the following section) are expected to be an I18N key, and must appear in this file.  Any other internationalized data used by the plugin itself is optional, but recommended.  Adding support for additional languages is done by adding an additional IETF language tag to the file with the additional translations:
```json
{
    "en": {
        "nav.stub": "Stub Module",
        "nav.stub.description": "The SDK test module",
        "tos.title": "Terms of Service",
        // ...
    },
    "la": {
        "tos.title": "verba autem opera",
        // other keys omitted for brevity and poor translation skills
    }
}
```

vCloud Director uses `en` if there are missing translations, and will display the specified key prefixed with a question mark (e.g. `?nav.stub`) if the `en` translation is missing.

### Module and Routing ###
The module is the main entry point into the application.  The name of this class must match the name provided to the `module` property in the `manifest.json`.  The module that is provided in the seed project creates an action to register the module as a top level extension, and dispatches that action so that vCD can load the plugin.  This file doesn't need to be modified beyond some cosmetic changes to I18N keys or module name, if desired.

```typescript
export class StubModule {
    constructor(private appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string) {
        const registration: ExtensionNavRegistration = {
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.stub",
            descriptionCode: "nav.stub.description"
        };
        appStore.dispatch(new ExtensionNavRegistrationAction(registration));
    }
}
```

The `stub.routes.ts` is where additional child routes for the module can be defined.  Refer to [Angular Routing & Navigation](https://angular.io/guide/router) for details on creating routes.

### Components ###
The component provided in the seed project provides a simple one page experience to showcase a component structure and some usage examples.  A real world plugin likely consists of several components.

#### stub.component.ts ####
```typescript
Component({
    selector: "vcd-stub",
    templateUrl: "./stub.component.html",
    styleUrls: ['./stub.component.scss']
})
export class StubComponent {
    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) {}
}
```
This is a very stripped down component.  It points to its HTML and style content, and it injects the `EXTENSION_ASSET_URL`.  This injection is required for the plugin to correctly locate any assets that are contained in the plugin, as seen in the `<img>` tag below.  The data for each plugin is loaded from the server in isolation from any other plugins, and in isolation from vCD itself.  In order for the plugin to be able to load its assets, it needs to be able to specify the root URL of those assets, which is created and managed by vCD.

#### stub.component.html ####
```html
<div>
    <h1 class="tos-title">{{"tos.title" | translate}}</h1>
    <p class="tos-text">{{"tos.1" | translate}}</p>
    <p class="tos-text">{{"tos.2" | translate}}</p>
    <img src="{{assetUrl}}/monkey.jpg" alt="Thoughtful Primate">
</div>
```
This example HTML shows how to use I18N data via the provided `translate` pipe, and it shows how to appropriately refer to plugin assets using the `assetUrl` property injected above.

#### stub.component.scss ####
This stylesheet provides some simple Sass-based constructs and style definitions for controlling the layout of the above HTML content.
```css
@mixin tos-padding {
    padding-left: 10px;
    padding-right: 10px;
}

.tos-title {
    @include tos-padding;
    color: #0000ff;
    font-style: italic;
    
}

.tos-text {
    @include tos-padding;
    color: #0000ff;
}

img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
}
```