---
layout: default
title:  "Types plugin"
category: CARE Package Plugins
catOrder: 3
hasMore: true
order: 2
permalink: /architecture/plugins/types
---
# Overview
This plugin allows you to work with Defined Entity Types, Interfaces and Behaviours. These Cloud Director entities are defined as typescript. More details on how to do that can be found here: [Defined Entities]({{ site.baseurl }}/docs/defined_entities/intro)

## Implemented Lifecycle methods
The types plugin provides the following lifecycle method implementations:
* Build Actions
  * generate
  * build
  * pack
  * deploy
* Deploy Actions
  * deploy

## Package payload
Type elements are collections of JSON files representing an entity from the Defined Entity Types API. These entities are:
* Interfaces
* Interface Behaviours
* Types
* Access Controls
Since Interface Behaviours are nested entities of the Interfaces, they are part of the parent Interface payload. The same applies to Access Controls, they are nested to the Types, so they are part of the parent Type payload.
This means there are two types of JSON files: Interface and Type. Please refer to the JSON schemas for the two types of JSON files:
### Types JSON Schema
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$ref": "#/definitions/Type",
    "definitions": {
        "Type": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "nss": {
                    "type": "string"
                },
                "version": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "vendor": {
                    "type": "string"
                },
                "schema": {
                    "type": "object"
                },
                "interfaces": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/URN"
                    }
                },
                "accessControls": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/AccessControl"
                    }
                }
            },
            "required": [
                "name",
                "nss",
                "version",
                "description",
                "vendor",
                "schema",
                "interfaces"
            ]
        },
        "URN": {
            "type": "string",
            "pattern": "^urn:[a-z0-9][a-z0-9-]{0,31}:[a-z0-9()+,\\-.:="
        },
        "AccessControl": {
            "type": "object",
            "properties": {
                "behaviorId": {
                    "$ref": "#/definitions/URN"
                },
                "accessLevelId": {
                    "$ref": "#/definitions/URN"
                }
            },
            "required": [
                "behaviorId",
                "accessLevelId"
            ]
        }
    }
}
```
### Interface JSON Schema
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$ref": "#/definitions/Intefrace",
    "definitions": {
        "Intefrace": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "nss": {
                    "type": "string"
                },
                "version": {
                    "type": "string"
                },
                "vendor": {
                    "type": "string"
                },
                "behaviors": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/InterfaceBehaviour"
                    }
                }
            },
            "required": [
                "name",
                "nss",
                "version",
                "vendor",
                "behaviors"
            ]
        },
        "InterfaceBehaviour": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "execution": {
                    "$ref": "#/definitions/ActivityBehaviourExecution"
                }
            },
            "required": [
                "name",
                "execution"
            ]
        },
        "ActivityBehaviourExecution": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "const": "Activity"
                },
                "id": {
                    "type": "string"
                }
            },
            "required": [
                "type",
                "id"
            ]
        }
    }
}
```