---
layout: default
title:  "Interfaces"
category: Defined Entities API
catOrder: 4
iconShape: objects
hasMore: true
order: 4
permalink: /docs/defined_entities_api/interfaces
---

# Defined Interfaces

Interfaces are collections of behaviors (actions). Interfaces are implemented by defined entity types. 

## Create a simple interface
```http
POST https://{api_host}/cloudapi/1.0.0/interfaces

{
    "name": "test_interface",
    "version": "1.0.0",
    "vendor": "vmware",
    "nss": "test_interface",
    "readonly": false
}
```


## Add behavior to interface
```http
POST https://{api_host}/cloudapi/1.0.0/interfaces/{interface_id}/behaviors

{
	"description": "behavior description",
    "name": "test_behavior",
    "execution": {
             "type": "noop"
    }
}
```