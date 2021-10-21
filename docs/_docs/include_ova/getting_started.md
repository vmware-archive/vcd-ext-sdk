---
layout: default
title:  "Getting Started"
category: Include OVA
catOrder: 5
order: 2
hasMore: true
labels: [Include OVA]
permalink: /docs/include_ova/getting_started
---
# Get started with Include OVA
This quick start shows you how to include OVA to a project and how to deploy it on a Cloud Director instance.

## Creating a project with OVA

Run the following command to generate a new project:
<div class="language-custom custom-code-block"> 
    {% include vcd-ext-wizard.html %}
    <span class="token keyword">You need to select which projects you want the CLI to generate in the mono repo. For this example we select `Import vApp` and press enter</span></div>
    <div><span class="token builtin">?</span> Import vApp:element name (importVApp) <span class="token keyword">Either press enter or type in a different `Import vApp` project name, for this example we press enter</span></div>
    <div><span class="token builtin">?</span> Import vApp:vApp name <span class="token keyword">You need to set the name of the future vApp, for this example we will name it `DemoVApp` and press enter</span></div>
    <div><span class="token builtin">?</span> Import vApp:OVA full local path <span class="token keyword">You need to give a full path to an OVA file and press enter</span></div>
</div>

Once the CLI project structure generation process completes, open the project folder in your favorite IDE and the structure should look like this:

<img src="{{ site.baseurl }}/assets/images/includeOva/freshIncludeOvaProjectStructure.png" width="600" alt="Include OVA"/>

## Deploying the example project

Use System administrator account to authenticate as a provider user. In the root of the project folder run

```bash
vcd-ext login userAliasName https://cell.url.com/cloudapi username
```

After the authentication has completed, in the root folder run

```bash
vcd-ext deploy
``` 
