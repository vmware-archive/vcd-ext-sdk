---
layout: default
title:  "Draft 1 (0.0.1)"
category: CARE Package Specification
catOrder: 2
hasMore: true
order: 3
permalink: /architecture/spec/draft_1
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
    <th>elements</th>
    <td>array/object</td>
    <td class="left">An array of objects describing the elements which are contained within the package.</td>
    <td>Yes</td>
    <td>-</td>
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
    <td>-</td>
  </tr>
</table>

### Example
```json
{
    "name": "types-demo",
    "version": "0.0.1",
    "vendor": "MyCompany",
    "specVersion": "0.0.1",
    "elements": [
        {
            "type": "@vcd/care-package-plugin-types/TypesCarePackagePlugin",
            "location": "packages/types/**/*.json"
        }
    ]
}
```

