---
layout: default
title:  "Overview"
category: UI Plugins
description: "Overview of UI Plugins"
catOrder: 3
order: 1
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/overview
---
# UI Plugins
Developing `UI Plugins` allow solution developers to create new UI components for [VMware Cloud Director][vcd]. The development platform 
gives access to common Cloud Director UI and client libraries, which results in an easy and effortless way of development 
and achieving a unified Cloud Director UX.

## Key Concepts
<table class="table table-vertical">
  <tr >
    <th>Scope</th>
    <td> The scope determines in which part of the Cloud Director a UI plugin will reside. There are two types of scopes: <b>tenant</b> and <b>provider</b></td>
  </tr>
  <tr >
    <th>Extension Points</th>
    <td> An extension point essentially is a Cloud Director predefined global or contextual navigation/menu placeholder, which a UI plugin will use to attach itself to and be used for navigation/plugin initialization. 
    There are finite number of extension points in Cloud Director, one can pick from. 
    </td>
  </tr>
</table>

[vcd]: https://www.vmware.com/products/cloud-director.html

