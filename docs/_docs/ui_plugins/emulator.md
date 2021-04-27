---
layout: default
title:  "Emulator"
category: UI Plugins
description: "Emulator"
catOrder: 3
order: 6
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/emulator
---
# VCD UI Emulator
The UI Plugin is seeded together with a Cloud Director bare minimum UI emulator, which allows one to locally serve the 
UI Plugin angular application and debug. The emulator is served by the [@vcd/ui-emulator][vcd-emulator] package.

One thing to pay attention to, when working with the emulator is the .env folder. Notice that at this point 
the folder contains the following files
![Env folder pre auth]({{ site.baseurl }}/assets/images/uiPlugins/env-folder.png)

The emulator package depends on the `.env` folder for configuring proxy settings and authenticating the angular app towards 
the rest api.

To test that, please authenticated against a running Cloud Director instance with an organisation account

`vcd-ext login userAliasName http://cell.url.com/cloudapi username@tenantName`

This CLI command will log in using the provided cell url as a tenant user. A session will be created and 
the token will be stored locally. 

In an example UI Plugin, please execute `npm run start`

The plugin is compiled and hosted as an Angular app inside a VCD emulator container under `localhost`. 
Notice that now the .env folder contains two more files - `proxy.conf.runtime.json` and `environment.runtime.json`.
They are both generated based on the templates in the folder, using the previously cached login session using the 
`vcd-ext login` CLI command. The `environment.runtime.json` file contains authentication information and the `proxy.conf.runtime.json` 
contains proxy configuration for the VCD APIs the emulator will be using. This way, the plugin hosted within the emulator, 
is as if hosted within an authenticated Cloud Director instance. 

[vcd-emulator]: https://www.npmjs.com/package/@vcd/ui-emulator