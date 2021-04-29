---
layout: default
title:  "Getting started"
category: Defined Entities
catOrder: 2
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
    <div>$ vcd-ext new</div>
    <div><span class="token builtin">?</span> Your solution name <span class="token keyword">types-demo</span></div>
    <div><span class="token builtin">?</span> Specify first version <span class="token keyword">0.0.1</span></div>
    <div><span class="token builtin">?</span> Specify vendor name <span class="token keyword">MyCompany</span></div>
    <div><span class="token builtin">?</span> Specify vendor link <span class="token keyword">http://example.com</span></div>
    <div><span class="token builtin">?</span> Specify solution license <span class="token keyword">BSD-2-Clause</span></div>
    <div><span class="token builtin">?</span> Select extensibility elements <span class="token keyword">Defined Entities</span></div>
    <div><span class="token builtin">?</span> Defined Entities:element name <span class="token keyword">types</span></div>
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
