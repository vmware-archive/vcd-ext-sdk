---
layout: default
title:  "Working with types"
category: Defined Entities
catOrder: 2
iconShape: objects
hasMore: true
order: 2
permalink: /docs/defined_entities_types
---
# Create Defined Entity Types

## Create a simple type
Defined entity types are defined as annotated Typescript classes. Regular Typescript classes are and processed as defined entity types, but can be referred by a type and included in the schema definition.

```typescript
/**
 * @definedEntityType
 */
export class Post {
    title: string;
    body: string;
}
```
### Output
After building the project with `npm run build`. The following output is genertated `packages/types/lib/types` folder
```json
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
    "interfaces": [],
    "accessControls": []
}
```
The output of the build is a `JSON` representation of the type, which includes all the data required to create the type on a running Cloud Director instance.
#### Properties
* `name` is the name of the source class
* `nss` is the name of the source class to lower case
* `version` is the version specified in the package.json of the root project
* `schema` is generated from the definition of the class
* `interfaces` is the list of interfaces this type implements
* `accessControls` is the list of `accessControls` required to invoke behaviours

## Referencing other Typescript types
As mentioned above other Typescript types can be referenced by the defined entity types. Let's modify out `Post` type by adding an array of `Comments`:
```typescript
class Comment {
    user: string;
    text: string
}

/**
 * @definedEntityType
 */
export class Post {
    ...
    comments: Comment[];
}
```
### Output
This translates to the following addition to the schema property:
```json
{
...
                    "comments": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "user": {
                                    "type": "string"
                                },
                                "text": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "user",
                                "text"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
...
}
```
## Using annotations to enhance or alter the default behaviour
The Typescript compiler uses the [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator) to transform the Typescript classes into JSON schema. This mechanism allows you to extend or modify the behaivour by using JSDoc annotations.

### Specify the format
```typescript
/**
 * @format uri-reference
 */
type URIReference = string;

/**
 * @definedEntityType
 */
export class Post {
...
    source: URIReference;
...
```

### Specify the type
```typescript
/**
 * @definedEntityType
 */
export class Post {
...
    /**
     * @asType object
     */
    data?: any;
...
```
The extended set of annotations is used, this includes the following basic annotations:
* `title`
* `description`
* `format`
* `pattern`
* `$comment`
* `contentMediaType`
* `contentEncoding`
* `minimum`
* `exclusiveMinimum`
* `maximum`
* `exclusiveMaximum`
* `multipleOf`
* `minLength`
* `maxLength`
* `minProperties`
* `maxProperties`
* `minItems`
* `maxItems`
* `uniqueItems`
* `propertyNames`
* `contains`
* `const`
* `examples`
* `default`
* `if`
* `then`
* `else`
* `readOnly`
* `writeOnly`
* `deprecated`
* `nullable`
* `asType`

For more information refer to the [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator) documentation

## Controlling the schema generation
In addition to using JSDoc annotations, it is possible to change the schema generation process by specifying additional configuration properties. This is done by modifying the `care.json` in the root of the project and add `configuration` property to the element you would like to modify the default behaviour for
```json
{
    "vendor": "MyCompany",
    "specVersion": "0.0.1",
    "elements": [
        {
            "name": "types",
            "type": "@vcd/care-package-plugin-types/TypesCarePackagePlugin",
            "configuration" : {
                "additionalProperties": true
            }
        }
    ]
}
```
List of support configuration properties:
* `sortProps` - Sort properties. Default: `true`
* `strictTuples` - Allow additional items on tuples. Default: `false`
* `skipTypeCheck` - Skip type checks for better performance. Default: `false`
* `encodeRefs` - According to the standard, references must be valid URIs but some tools do not support encoded references. Default: `true`
* `additionalProperties` - Controls whether or not to allow additional properties for objects that have no index signature. Default: `false`
