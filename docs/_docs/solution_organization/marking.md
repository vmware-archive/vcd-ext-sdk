---
layout: default
title: Tag Solution Organization
category: Solution Organization
catOrder: 3
hasMore: true
order: 2
permalink: /docs/solution_organization/marking
---
# Tag Solution Organization

1. [Create define entity interface (static)](#1-post-cloudapi100interfaces)
2. [Create define entity type (static)](#2-post-cloudapi100entitytypes)
3. [Create define entity - the object that points to all the solution organization resources. (requires user modification)](#3-post-cloudapi100entitytypesurnvcloudtypevmwaresolutions_organization_provider100)

## 1. POST /cloudapi/1.0.0/interfaces

```json
{
    "name": "Provider Organization",
    "vendor": "vmware",
    "nss": "solutions_organization_provider",
    "version": "1.0.0",
    "readonly": false
}
```
## 2. POST /cloudapi/1.0.0/entityTypes/

```json
{
    "id": "urn:vcloud:type:vmware:solutions_organization_provider:1.0.0",
        "name": "Provider Organization",
        "description": "Logical group of resources hosting Cloud Director Solutions Add-ons.",
        "nss": "solutions_organization_provider",
        "version": "1.0.0",
        "inheritedVersion": null,
        "externalId": null,
        "schema": {
        "application/json": {
            "type": "object",
                "properties": {
                "organization": {
                    "$ref": "#/definitions/Organization"
                }
            },
            "definitions": {
                "id": {
                    "type": "string",
                        "pattern": "^urn:vcloud:[a-zA-Z0-9:._]+$"
                },
                "catalog": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "capabilities": {
                            "type": "array",
                                "items": {
                                "type": "string",
                                    "enum": [
                                    "private",
                                    "shared"
                                ]
                            }
                        }
                    }
                },
                "network": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "capabilities": {
                            "type": "array",
                                "items": {
                                "type": "string",
                                    "enum": [
                                    "dhcp"
                                ]
                            }
                        }
                    }
                },
                "securityGroup": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "capabilities": {
                            "type": "array",
                                "items": {
                                "type": "string",
                                    "enum": [
                                    "internetAccess",
                                    "cloudDirectorAPIAccess"
                                ]
                            }
                        }
                    }
                },
                "storagePolicy": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "capabilities": {
                            "type": "array",
                                "items": {
                                "type": "string",
                                    "enum": [
                                    "compression",
                                    "caching",
                                    "encryption",
                                    "replication"
                                ]
                            }
                        }
                    }
                },
                "computePolicy": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "capabilities": {
                            "type": "array",
                                "items": {
                                "type": "string",
                                    "enum": [
                                    "gpu"
                                ]
                            }
                        }
                    }
                },
                "vdc": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "capabilities": {
                            "type": "array",
                                "items": {
                                "type": "string",
                                    "enum": []
                            }
                        },
                        "networks": {
                            "type": "array",
                                "items": {
                                "$ref": "#/definitions/network"
                            }
                        },
                        "securityGroups": {
                            "type": "array",
                                "items": {
                                "$ref": "#/definitions/securityGroup"
                            }
                        },
                        "storagePolicies": {
                            "type": "array",
                                "items": {
                                "$ref": "#/definitions/storagePolicy"
                            }
                        },
                        "computePolicies": {
                            "type": "array",
                                "items": {
                                "$ref": "#/definitions/computePolicy"
                            }
                        }
                    }
                },
                "Organization": {
                    "type": "object",
                        "properties": {
                        "id": {
                            "$ref": "#/definitions/id"
                        },
                        "catalogs": {
                            "type": "array",
                                "items": {
                                "$ref": "#/definitions/catalog"
                            }
                        },
                        "vdcs": {
                            "type": "array",
                                "items": {
                                "$ref": "#/definitions/vdc"
                            }
                        }
                    }
                }
            }
        }
    },
    "vendor": "vmware",
        "interfaces": [],
        "hooks": {},
    "readonly": false
}
```

## 3. POST /cloudapi/1.0.0/entityTypes/urn:vcloud:type:vmware:solutions_organization_provider:1.0.0

```json
{
    "entityType": "urn:vcloud:type:vmware:solutions_organization_provider:1.0.0",
        "name": "Provider Organization",
        "entity": {
        "organization": {
            "id": "urn:vcloud:org:",
                "vdcs": [
                {
                    "id": "urn:vcloud:vdc:",
                    "capabilities": [],
                    "networks": [
                        {
                            "id": "urn:vcloud:network:",
                            "capabilities": []
                        }
                    ],
                    "securityGroups": [],
                    "computePolicies": [],
                    "storagePolicies": [
                        {
                            "id": "urn:vcloud:orgvdcstoragepolicy:",
                            "capabilities": []
                        }
                    ]
                }
            ],
                "catalogs": [
            ]
        }
    }
}
```
