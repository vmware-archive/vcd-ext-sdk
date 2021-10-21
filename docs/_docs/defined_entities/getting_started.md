---
layout: default
title:  "Getting started"
category: Defined Entities
catOrder: 4
iconShape: objects
hasMore: true
order: 2
permalink: /docs/defined_entities/getting_started
---
# Get started with Defined Entities

This quickstart shows you how to create types project, add a type and deploy it on a Cloud Director instance.

## Create a types project
Run the following command to generate a new project:
<div class="language-custom custom-code-block">
    {% include vcd-ext-wizard.html %}
    <span class="token keyword">You need to select which projects you want the CLI to generate in the mono repo. For this example we select `Defined Entities` and press enter</span></div>
    <div><span class="token builtin">?</span> Defined Entities:element name (types) <span class="token keyword">Either press enter or type in a different `Defined Entities` project name, for this example we press enter</span></div>
</div>

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
