---
layout: default
title:  "Getting Started"
category: UI Plugins
description: "Getting started on UI Plugins"
catOrder: 4
order: 2
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/getting_started
---
# Get started with UI Plugins 
This quick start shows you how to create UI Plugins project, how to host the project locally and how to deploy it on a Cloud Director instance.

## Creating the UI plugin project

Run the following command to generate a new project:
<div class="language-custom custom-code-block"> 
    {% include vcd-ext-wizard.html %}
    <span class="token keyword">You need to select which projects you want the CLI to generate in the mono repo. For this example we select `UI Plugin` and press enter</span></div>
    <div><span class="token builtin">?</span> UI Plugin:element name (uiPlugin) <span class="token keyword">Either press enter or type in a different UI Plugin project name, for this example we press enter</span></div>
</div>

Once the CLI project structure generation process completes, open the project folder in your favorite IDE and the structure should look like this:

![Monorepo structure]({{ site.baseurl }}/assets/images/uiPlugins/ui-plugin-only-structure.png)

The UI Plugin project is a self-contained Angular application, which can be locally hosted for development purposes. 
The UI Plugin can be build and deployed to a VCD instance at any time.

## Running the example empty project

To begin with, you will have bare minimum UI Plugin, which you can build and host locally to verify that the 
seeding of the monorepo plugin project was successful. To verify that, please authenticated against a running Cloud Director
instance with an organisation account

```bash
vcd-ext login userAliasName https://cell.url.com/cloudapi username@tenantName
```

To host the UI plugin locally run

```bash
npm run start
```

Going to localhost in your browse you should see the following example

![Initial UI]({{ site.baseurl }}/assets/images/uiPlugins/emulator-hosting-plugin.png)

For further details about the `emulator` please refer to: [UI Emulator]({{ site.baseurl }}/docs/ui_plugins/emulator)

## Deploying the example project

Use System administrator account to authenticate as a provider user. In the root of the project folder run

```bash
vcd-ext login userAliasName https://cell.url.com/cloudapi username
```

After the authentication has completed, in the root folder run

```bash
npm run deploy
``` 