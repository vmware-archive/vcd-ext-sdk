---
layout: default
title:  "Defined Entities"
category: Defined Entities API
catOrder: 4
iconShape: objects
hasMore: true
order: 5
permalink: /docs/defined_entities_api/entities
---
# Defined Entities

Once defined entity types and interfaces are created, you can start creating entities.

### Create a defined entity
```http
POST https://{api_host}/cloudapi/1.0.0/entityTypes/{entity_type_id}

{
   "name":"test_entity",
   "entity":{
        "title": "My first blog post",
        "body": "This is my first blog post on this system. Enjoy"
   }
}
```

### Resolve a defined entity

```http
POST https://{api_host}/cloudapi/1.0.0/entities/{entity_id}/resolve
```