import requests, time, base64, sys, os, json, argparse, urllib3, configparser
from pprint import pprint

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
requests.packages.urllib3.add_stderr_logger()

class UiPlugin:
    def __init__(self, vcduri, username, org, password):
        self._token = None
        self.vcduri = vcduri
        self.current_ui_extension = {}
        self.getToken(username, org, password)

    def __request(self, method, path=None, data=None, uri=None, auth=None, content_type="application/json", accept="application/json"):
        headers = {}
        if self._token:
            headers['x-vcloud-authorization'] = self._token
        if auth:
            headers['Authorization'] = auth
        if content_type:
            headers['Content-Type'] = content_type
        if accept:
            headers['Accept'] = accept

        if path:
            uri = self.vcduri+path

        r = requests.request(method, uri, headers=headers, data=data, verify=False)
        if 200 <= r.status_code <= 299:
            return r
        raise Exception ("Unsupported HTTP status code (%d) encountered" % r.status_code)

    def getToken(self, username, org, password):
        r = self.__request('POST',
                         '/api/sessions',
                         auth='Basic %s' % base64.b64encode('%s@%s:%s' % (username, org, password)),
                         accept='application/*+xml;version=29.0')
        self._token = r.headers['x-vcloud-authorization']

    def getUiExtensions(self):
        return self.__request('GET', '/cloudapi/extensions/ui/')

    def getUiExtension(self, eid):
        return self.__request('GET', '/cloudapi/extensions/ui/%s'%eid)

    def postUiExtension(self, data):
        return self.__request('POST', '/cloudapi/extensions/ui/', json.dumps(data))

    def putUiExtension(self, eid, data):
        return self.__request('PUT', '/cloudapi/extensions/ui/%s'%eid, json.dumps(data))

    def deleteUiExtension(self, eid):
        return self.__request('DELETE', '/cloudapi/extensions/ui/%s'%eid)

    def postUiExtensionPlugin(self, eid, data):
        return self.__request('POST', '/cloudapi/extensions/ui/%s/plugin'%eid, json.dumps(data))

    def putUiExtensionPlugin(self, uri, data):
        return self.__request('PUT', uri=uri, content_type="application/zip", accept=None, data=data)

    def deleteUiExtensionPlugin(self, eid):
        return self.__request('DELETE', '/cloudapi/extensions/ui/%s/plugin'%eid)

    def getUiExtensionTenants(self, eid):
        return self.__request('GET', '/cloudapi/extensions/ui/%s/tenants'%eid)

    def postUiExtensionTenantsPublishAll(self, eid):
        return self.__request('POST', '/cloudapi/extensions/ui/%s/tenants/publishAll'%eid)

    def postUiExtensionTenantsPublish(self, eid, data):
        return self.__request('POST', '/cloudapi/extensions/ui/%s/tenants/publish'%eid, data)

    def postUiExtensionTenantsUnPublishAll(self, eid):
        return self.__request('POST', '/cloudapi/extensions/ui/%s/tenants/unpublishAll'%eid)

    def postUiExtensionTenantsUnPublish(self, eid, data):
        return self.__request('POST', '/cloudapi/extensions/ui/%s/tenants/unpublish'%eid, data)

###

    def postUiExtensionPluginFromFile(self, eid, fn):
        data = {
            "fileName": fn.split('/')[-1],
            "size": os.stat(fn).st_size
        }
        return self.postUiExtensionPlugin(eid, data)

    def putUiExtensionPluginFromFile(self, eid, fn):
        data = open(fn, 'rb').read()
        return self.putUiExtensionPlugin(eid, data)

    def deleteUiExtensionPluginSafe(self, eid):
        if self.current_ui_extension.get('plugin_status', None) == 'ready':
            return self.deleteUiExtensionPlugin(eid)
        else:
            print ("Unable to delete plugin for ", eid)
            return None

    def walkUiExtensions(self):
        for ext in self.getUiExtensions().json():
            self.current_ui_extension = ext
            yield ext

###

    def parseManifest(self, fn, enabled=True):
        data = json.load(open(fn))
        return {
            "pluginName": data['name'],
            "vendor": data['vendor'],
            "description": data['description'],
            "version": data['version'],
            "license": data['license'],
            "link": data['link'],
            "tenant_scoped": "tenant" in data['scope'],
            "provider_scoped": "service-provider" in data['scope'],
            "enabled": enabled
            }

    def addExtension(self, data, fn, publishAll=False):
        r = self.postUiExtension(data).json()
        eid = r['id']
        self.addPlugin(eid, fn, publishAll=publishAll)

    def addPlugin(self, eid, fn, publishAll=False):
        r = self.postUiExtensionPluginFromFile(eid, fn)
        link = r.headers["Link"].split('>')[0][1:]

        self.putUiExtensionPluginFromFile(link, fn)

        if publishAll:
            self.postUiExtensionTenantsPublishAll(eid)

    def removeAllUiExtensions(self):
        for ext in self.walkUiExtensions():
            self.removeExtension(ext['id'])

    def removeExtension(self, eid):
        self.removePlugin(eid)
        self.deleteUiExtension(eid)

    def removePlugin(self, eid):
        self.deleteUiExtensionPluginSafe(eid)

    def replacePlugin(self, eid, fn, publishAll=False):
        self.removePlugin(eid)
        self.addPlugin(eid, fn, publishAll=publishAll)

    ###

    def deploy(self, basedir):
        manifest = self.parseManifest('%s/src/public/manifest.json'%basedir, enabled=True)

        eid = None
        for ext in self.walkUiExtensions():
            if manifest['pluginName'] == ext['pluginName'] and manifest['version'] == ext['version']:
                eid = ext['id']
                break

        if not eid:
            self.addExtension(manifest, '%s/dist/plugin.zip'%basedir, publishAll=True)
        else:
            self.replacePlugin(eid, '%s/dist/plugin.zip'%basedir, publishAll=True)

    def remove(self, basedir):
        manifest = self.parseManifest('%s/src/public/manifest.json'%basedir, enabled=True)

        eid = None
        for ext in self.walkUiExtensions():
            if manifest['pluginName'] == ext['pluginName'] and manifest['version'] == ext['version']:
                return self.removeExtension(ext['id'])

        raise Exception("Extension not found")



if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('ui_ext_api.ini')
    cfg = config['DEFAULT']
    if not cfg:
        raise ValueError('Failed to open ui_ext_api.ini file.')

    ui = UiPlugin(cfg['vcduri'], cfg['username'], cfg['organization'], cfg['password'])

    parser = argparse.ArgumentParser('UI Extension Helper')
    parser.add_argument('command', help='Valid Commands: deploy, remove, removeAllUiExtensions, listUiExtensions')
    args = parser.parse_args()

    if args.command == 'deploy':
        ui.deploy(os.getcwd())
    elif args.command == 'remove':
        ui.remove(os.getcwd())
    elif args.command == 'removeAllUiExtensions':
        ui.removeAllUiExtensions()
    elif args.command == 'listUiExtensions':
        pprint(ui.getUiExtensions().json())
    else:
        raise ValueError('Command (%s) not found' % args.command)
        sys.exit(0)
