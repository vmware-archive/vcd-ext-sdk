---
layout: default
title:  "Calibrating OVA configuration"
category: Include OVA
catOrder: 5
order: 3
hasMore: true
labels: [Include OVA]
permalink: /docs/include_ova/calibrating_ova_configuration
---
# Calibrating OVA configuration
Once the project is created, the configurations could be changed.

Every project has a care.json file in the root directory.<br/>
It contains details for the selected plugins.

Here is an example of it:
```json
{
    "vendor": "vmware",
    "specVersion": "0.0.1",
    "platformVersion": "",
    "elements": [
    {
        "name": "importVApp",
        "type": "@vcd/care-package-plugin-import-vapp/ImportVAppCarePackagePlugin",
        "configuration": {
            "vAppName": "DemoVApp",
            "instantiateOvfProperties": []
        }
    }
]
}
```

The plugin in this tutorial is with type:<br/>
"@vcd/care-package-plugin-import-vapp/ImportVAppCarePackagePlugin"

## Rename the vApp name
In order to change the name of the vApp the field configuration.vAppName should be changed from the above example.
```json
"configuration": {
    "vAppName": "newDemoVAppName",
    ...
}
```

## Specify custom properties
The custom properties can be set in the configuration.instantiateOvfProperties
```json
"instantiateOvfProperties": [
    {
        "key": "Property1",
        "value": "Property1_value" 
    },
    {
        "key": "Property2",
        "value": "Property2_value"
    }
]
```
