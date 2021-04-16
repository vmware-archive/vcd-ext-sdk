---
layout: default
title:  "Getting started"
category: Defined Entities
catOrder: 2
iconShape: objects
hasMore: true
order: 2
permalink: /docs/defined_entities_getting_started
---
# Get started with Defined Entities

This quickstart shows you how to create types project, add a type and deploy it on a Cloud Director instance.

## Create a types project
Run the following command to generate a new project:
```bash
vcd-ext new
? Your solution name types-demo
? Specify first version 0.0.1
? Specify vendor name MyCompany
? Specify vendor link http://example.com
? Specify solution license BSD-2-Clause
? Select extensibility elements Defined Entities
? Defined Entities:element name types
```
## Create a type
Navigate to `types-demo/packages/types/src` and create new file called `Post.ts` with the following content
```typescript
/**
 * @definedEntityType
 */
export class Post {
    title: string;
    body: string;
}
```
Modify the `index.ts` file by including an export of the Post class:
```typescript
export * from './Post';
```
## Build the project
In the root of the project folder run:
```bash
npm run build
```

## Authenticate against running Cloud Director instance
Use System administrator account to authenticate as a provider user. In the root of the project folder run:
```bash
vcd-ext login local https://cloud.director.local/cloudapi administrator
```

## Deploy the new type
In the root of the project folder run:
```bash
npm run deploy
```