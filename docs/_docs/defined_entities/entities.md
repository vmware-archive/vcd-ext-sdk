---
layout: default
title:  "Working with entities"
category: Defined Entities
catOrder: 2
iconShape: objects
hasMore: true
order: 5
permalink: /docs/defined_entities/entities
---
# Working with entities

Once defined entity types and interfaces are created, you can start creating entities.

### Initialize the clients
```typescript
import { CloudDirectorConfig, DefinedEntityApi, DefinedEntityTypeApi, DefinedInterfaceBehaviorsApi } from '@vcd/node-client'
const apiConfig = CloudDirectorConfig.fromDefault()
const deApi: DefinedEntityApi = apiConfig.makeApiClient(DefinedEntityApi)
const behApi: DefinedInterfaceBehaviorsApi = apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi)
const detApi: DefinedEntityTypeApi = apiConfig.makeApiClient(DefinedEntityTypeApi)
```

### Create Defined Entity
```typescript
deApi.createDefinedEntity({
    name: name,
    entity: {
        title: "My first blog post",
        body: "This is my first blog post on this system. Enjoy",
        comments: []
    }
}, `urn:vcloud:type:MyCompany:post:0.0.1`)
```

### List all entities
```typescript
const resp = await deApi.getDefinedEntitiesByEntityType('MyCompany', 'post', '0.0.1', 1, 100)
resp.body.values.forEach(de => {
    console.log(JSON.stringify(de, null, 2))
})
```

### Resolve the entity
```typescript
deApi.resolveDefinedEntity(id);
```