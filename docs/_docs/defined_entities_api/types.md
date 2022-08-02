---
layout: default
title:  "Defined Entity Types"
category: Defined Entities API
catOrder: 4
iconShape: objects
hasMore: true
order: 3
permalink: /docs/defined_entities_api/types
---
# Defined Entity Types

A defined entity type describes the structure and behaviors of defined entities.

## Create a simple type
```http
POST https://{api_host}/cloudapi/1.0.0/entityTypes

{
    "name": "Post",
    "nss": "post",
    "version": "0.0.1",
    "vendor": "MyCompany",
    "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$ref": "#/definitions/Post",
        "definitions": {
            "Post": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string"
                    },
                    "body": {
                        "type": "string"
                    }
                },
                "required": [
                    "title",
                    "body"
                ],
                "additionalProperties": false
            }
        }
    },
    "interfaces": []
}
```

The ```schema``` field is the JSON-Schema valid definition of the information that you can store in the defined entities instantiating this type. The ```interfaces``` field stores a list of interface ids that this defined entity type is referenced by (these interfaces contain all the behaviors which can be invoked on instances of this type). 

