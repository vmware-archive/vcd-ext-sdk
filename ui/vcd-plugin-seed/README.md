# VCD UI Plugin Seed #
This is a seed project for building plugins for the vCloud Director UI using Angular 4 and [Clarity](https://github.com/vmware/clarity).

## Getting Started ##
This seed project works with version 9.1.0 of vCloud Director.

### Prerequisites ###
It is recommended that developers be familiar with Angular 4 coding (including modules and component resolution), and have the appropriate tooling installed.  This document assumes Yarn as the package manager.

An installation of vCloud Director version 9.1.0 is required to test the plugin.

### Build ###
```bash
git clone https://github.com/vmware/vcd-ext-sdk.git
cd vcd-ext-sdk/ui/vcd-plugin-seed

# install project dependencies
yarn

# build plugin
yarn run build
```

At this point, there will be a `plugin.zip` in the `dist/` folder.

### Install ###
A service provider admin account is necessary to install the plugin into vCloud Director.  There is currently no UI to manage plugins, so the vCD API will be used for the install. `SERVER` in the following example refers to the server endpoint of the vCD installation, and `TOKEN` is the `x-vcloud-authorization` header value returned by the initial session creation request.
```bash
# create a session for sys admin user
SERVER="vcloud.example.com" curl --header 'Accept: application/*+xml;version=30.0' --insecure --basic --data '' --user 'administrator@System:pa$$w0rd' --verbose https://$SERVER/api/sessions

# register the plugin, providing the same values as in the manifest.json
SERVER="vcloud.example.com" TOKEN="c2f4258224ce4489b4e4474e4e34db15" curl --header 'Accept: application/json' --header 'Content-Type: application/json' --header "x-vcloud-authorization: $TOKEN" --insecure --verbose https://$SERVER/cloudapi/extensions/ui --data '{"pluginName": "Stub plugin", "vendor": "VMware", "description": "", "version": "1.0.0", "license": "BSD-2", "link": "http://vcloud.example.com", "provider_scoped": true, "enabled": true}'

# enable upload on the newly registered plugin (endpoint is in the Location header of previous response)
# size is the plugin.zip's size in KB
SERVER="vcloud.example.com" TOKEN="c2f4258224ce4489b4e4474e4e34db15" PLUGIN="urn:vcloud:uiPlugin:1e634a62-a98a-46c0-b9dd-7e2c5a9e8688" curl --header 'Accept: application/json' --header 'Content-Type: application/json' --header "x-vcloud-authorization: $TOKEN" --insecure --verbose https://$SERVER/cloudapi/extensions/ui/$PLUGIN/plugin --data '{"fileName": "plugin.zip", "size": 56623}'

# Upload plugin.zip to vCloud Director
# upload path is in the Link response header of the previous call
SERVER="vcloud.example.com" TOKEN="c2f4258224ce4489b4e4474e4e34db15" curl --header 'Content-Type: application/zip' --header "x-vcloud-authorization: $TOKEN" --insecure --verbose https://$SERVER/transfer/19d7fafd-6670-4c2a-983f-0b3a49725d2e/plugin.zip --data-binary @dist/plugin.zip

```

After completing the above sequence of calls, the sample plugin will be available from the primary navigation menu of vCloud Director's Provider Portal.