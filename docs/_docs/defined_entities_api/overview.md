---
layout: default
title:  "Overview"
category: Defined Entities API
catOrder: 4
iconShape: objects
hasMore: true
order: 1
permalink: /docs/defined_entities_api/overview
---
# Defined Entities

Defined entities allow solution developers to create new types of entities at runtime in Cloud Director. These entities benefit from the same Access Control management, entity identification and resolution, metadata and other common to Cloud Director native entities characteristics.

## Key Concepts

### Defined Interface

Conceptually similar to an interface in Java, an interface for defined entities represents a reference type with a collection of behaviors. An interface can contain any number of methods, including 0. An interface with 0 methods has value as a "marker" interface–a structure that can be used to infer a logical relationship between defined entity types that implement a common interface.

### Defined Entity Type

A defined entity type describes the structure and behaviors of defined entities. The behaviors are defined for a type by associating 1 or more interfaces with the type. The structure is defined directly on the type as a schema that represents what fields/attributes must be present in a defined entity, as well as the data types, cardinality, and optionality of the fields.

### Defined Entity

A defined entity is an instance of a type. If 'SDDC' is the defined entity type, then instances named 'sddc-customer-a-east' and 'sddc-customer-a-west' would be example instances of that type.

### Behavior

Behaviors are operations that can be invoked. The invocation of behaviors applies only to their existence on a defined entity - the association of a behavior with an interface or with a defined entity type is not an executable construct.
A behavior is defined by an identifier (name) for an operation to perform, possible input parameters for the operation, and a mechanism for executing the operation. Some example of possible ways to execute an operation include, but are not limited to: loosely coupled message bus interaction, webhooks, vRO workflow execution.


## Visual representation

<img src="{{ site.baseurl }}/assets/images/definedEntities/rde-diagram.png" style="width: 40%" alt="RDE diagram"/> 