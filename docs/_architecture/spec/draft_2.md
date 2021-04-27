---
layout: default
title:  "Draft 2 (0.0.2)"
category: CARE Package Specification
catOrder: 2
hasMore: true
order: 2
permalink: /architecture/spec/draft_2
---
# Overview

CARE package stands for: Cloud ARchive for Extensions. Its an archive which contains all the objects and configurations required by an extension to be deployed and fully functioning. These include:
* UI Plugins
* Defined Entity Types, Interfaces and Behaviours
* API Extension Service definitions
* OVA containing a deployment of a backend API extension
* ....

# Structure
The care package is a ZIP file or a folder (unzipped format), it contains `manifest.json` file and any other file described in the manifest. 

## Manifest
The manifest contains information about the package itself, the required input parameters and the elements it contains.

### Package Information
The following properties are used to describe the package
<table class="table">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required</th>
    <th>Default Value</th>
  </tr>
  <tr >
    <th>name</th>
    <td>string ([a-zA-Z0-9-_]+)</td>
    <td class="left">The name of the package. It is used to identify the package within a repository or running system.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>version</th>
    <td>string([Semver](https://semver.org/))</td>
    <td class="left">The version of the package.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>vendor</th>
    <td>string ([a-zA-Z0-9-_]+)</td>
    <td class="left">Identifier of the organization or the user producer of the package.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>specVersion</th>
    <td>string([Semver](https://semver.org/))</td>
    <td class="left">The version of the CARE package specification.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>platformVersion</th>
    <td>string([Semver](https://semver.org/))</td>
    <td class="left">The minimum required version of the Cloud Director. If not provided, consumers should not perform platform version check.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>parameters</th>
    <td>object([JSON Schema](http://json-schema.org/))</td>
    <td class="left">Parameters are described using JSON schema. The JSON schema should define a root object with properties, which the user must/can provide. The schema can be also evaluated by a data driven UI or CLI to generate the required input fields.</td>
    <td>No</td>
    <td>{}</td>
  </tr>
  <tr >
    <th>elements</th>
    <td>array/object</td>
    <td class="left">An array of objects describing the elements which are contained within the package.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>rights</th>
    <td>array/string</td>
    <td class="left">List of Cloud Director rights required by the solution to perform deployment. In case rights are not provided warning should be presented to the user or package will fail to deploy</td>
    <td>No</td>
    <td>-</td>
  </tr>
  <tr >
    <th>plugins</th>
    <td>object</td>
    <td class="left">Mapping between plugin name and plugin location in a form:
&lt;scope&gt;/&lt;pluginName&gt;: plugins/&lt;scope&gt;/&lt;pluginName&gt;/deploy.js
The plugin location should exists within the package and point to a valid plugin</td>
    <td>No</td>
    <td>-</td>
  </tr>
</table>

### Predefined Parameters
Predefined parameters are a contract between prescribed environments like Cloud Director Service and CARE package developers. In such environments these parameters are pre-filled by the system and not provided by the user.
<table class="table">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr >
    <th>org</th>
    <td>URN</td>
    <td class="left">ID of the provider org</td>
  </tr>
  <tr >
    <th>vdc</th>
    <td>URN</td>
    <td class="left">ID of the org vdc. The org vdc must be part of the org.</td>
  </tr>
  <tr >
    <th>network</th>
    <td>URN</td>
    <td class="left">ID of the org vdc network. The org vdc network must be part of the org vdc.</td>
  </tr>
</table>

### Elements
The list of elements contains description of a specific extensibility component, as well as a pointer within the package to any files if applicable to the element type.
<table class="table">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required</th>
    <th>Default Value</th>
  </tr>
  <tr >
    <th>type</th>
    <td>string</td>
    <td class="left">The type of the parameter one of the following values. The type points to a specific Class within a Javascript module. The format is the following: &lt;scope&gt;/&lt;module&gt;/&lt;class&gt;. Scope is optional.</td>
    <td>Yes</td>
    <td>-</td>
  </tr>
  <tr >
    <th>location</th>
    <td>string(glob syntax)</td>
    <td class="left">The relative to the root of the package path pointing to one or more files required by the type of element.</td>
    <td>No</td>
    <td>Each element type will define a default location:
ui: ui/build/*.zip
types: types/**/*.json
ova: **/*.ova</td>
  </tr>
  <tr >
    <th>configuration</th>
    <td>object</td>
    <td class="left">A mapping between the element's type configuration and a static value or path to an input parameter. The keys in this object are defined by each element type.</td>
    <td>No</td>
    <td>-</td>
  </tr>
</table>

### Example
```json
{
    "name": "test-app",
    "version": "1.0.0",
    "vendor": "MyCompany",
    "specVersion": "0.0.2",
    "parameters": {
        "type": "object",
        "properties": {
            "org": {
                "type": "string",
                "format": "urn"
            }
        }
    },
    "elements": [
        {
            "type": "@vcd/care-package-plugin-types/TypesCarePackagePlugin",
            "location": "packages/types/**/*.json"
        },
        {
            "type": "@vcd/care-package-plugin-ova/OVACarePackagePlugin",
            "location": "packages/ova/**/*.ova",
            "configuration": {
                "org": {
                    "$ref": "#/parameters/org",
                }
            }
        }
    ]
}
```

