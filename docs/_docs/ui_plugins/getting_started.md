---
layout: default
title:  "Getting Started"
category: UI Plugins
description: "Getting started on UI Plugins"
catOrder: 3
order: 2
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/getting_started
---
# Get started with UI Plugins 
This quick start shows you how to create UI Plugins project, how to host the project locally and how to deploy it on a Cloud Director instance.

## Creating the UI plugin project

Run the following command to generate a new project:

`vcd-ext new`

Then you will have to go through a couple of setup steps

`? Your solution name` Enter a solution name (GettingStarted)

`? Specify first version (0.0.1)` Either press enter or type in a different version

`? Specify vendor name` Type in vendor name, for this example we type in `vmware`

`? Specify vendor link (http://example.com)` Either press enter or type in a different vendor link, for this example we press enter

`? Specify solution license (BSD-2-Clause)` Either press enter or type in a different license type, for this example we press enter

`? Select extensibility elements (Press <space> to select, <a> to toggle all, <i> to invert selection) 
 ❯◯ Defined Entities
  ◯ UI Plugin`
  
You need to select which projects you want the CLI to generate in the mono repo. For this example we select `UI Plugin` and press enter

`? UI Plugin:element name (uiPlugin)` Either press enter or type in a different UI Plugin project name, for this example we press enter

Once the CLI project structure generation process completes, open the project folder in your favorite IDE and the structure should look like this:

![Monorepo structure]({{ site.baseurl }}/assets/images/uiPlugins/ui-plugin-only-structure.png)

The UI Plugin project is a self-contained Angular application, which can be locally hosted for development purposes. 
The UI Plugin can be build and deployed to a VCD instance at any time.

## Running the example empty project

To begin with, you will have bare minimum UI Plugin, which you can build and host locally to verify that the 
seeding of the monorepo plugin project was successful. To verify that, please authenticated against a running Cloud Director
instance with an organisation account

`vcd-ext login userAliasName http://cell.url.com/cloudapi username@tenantName`

To host the UI plugin locally run

`npm run start`

Going to localhost in your browse you should see the following example

![Initial UI]({{ site.baseurl }}/assets/images/uiPlugins/emulator-hosting-plugin.png)

For further details about the `emulator` please refer to: [UI Emulator]({{ site.baseurl }}/docs/ui_plugins/emulator)

## Deploying the example project

Use System administrator account to authenticate as a provider user. In the root of the project folder run

`vcd-ext login userAliasName http://cell.url.com/cloudapi username`

after the authentication has completed, in the root folder run

`npm run deploy` 