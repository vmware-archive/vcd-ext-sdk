---
layout: default
title:  "Interfaces and behaviours"
category: Defined Entities
catOrder: 2
iconShape: objects
hasMore: true
order: 3
permalink: /docs/defined_entities_interfaces
---
# Add behaviours to entities

## Create a simple interface
Inerfaces are defined as annotated Typescript interfaces. Those interfaces can be then implemented by the defined entity types. Interfaces are used for two reasons, ability to search all entities, which implement the same interface and defining a behavior on an entity.

```typescript
/**
 * @definedEntityInterface
 */
export interface Commentable {
}

/**
 * @definedEntityType
 */
export class Post implements Commentable {
    title: string;
    body: string;
}
```
### Output
After building the project with `npm run build`. The following output is genertated `packages/types/lib/interfaces` folder
```json
{
    "name": "Searchable",
    "nss": "searchable",
    "version": "0.0.1",
    "vendor": "MyCompany",
    "behaviors": []
}
```

#### Properties
* `name` is the name of the source class
* `nss` is the name of the source class to lower case
* `version` is the version specified in the package.json of the root project
* `vendor` the vendor specified in the `care.json` file
* `behaviours` is the list of interfaces this type implements

## Define behaviours
To define a behaviour simply define a method on the interface.
```typescript
/**
 * @definedEntityInterface
 */
export interface Commentable {
    addComment(comment: Comment): void
}
```
At this point Typescript compiler will throw an error that the class, which implement incorrectly the modified interface. To fix that we need to implement the needed methods.
```typescript
import { AccessControl } from '@vcd/ext-compiler'
...
/**
 * @definedEntityType
 */
export class Post implements Commentable {
    title: string;
    body: string;
    comments: Comment[];

    @AccessControl('urn:vcloud:accessLevel:FullControl')
    addComment(comment: Comment): void {}
}
```
Notice that we do not only implemented the missing method, but also added an `@AccessControl` annotation to make sure that only users with full controll over the entity can run the `addComment` behaviour.
You can find more information about entity access control in the [official documentation](https://docs.vmware.com/en/VMware-Cloud-Director/10.2/VMware-Cloud-Director-Service-Provider-Admin-Portal-Guide/GUID-0749DEA0-08A2-4F32-BDD7-D16869578F96.html)