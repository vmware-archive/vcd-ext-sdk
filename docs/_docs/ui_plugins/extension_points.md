---
layout: default
title:  "Extension points"
category: UI Plugins
description: "Extension points in UI Plugins"
catOrder: 4
order: 3
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/extension_points
---
# Extension points
An extension point essentially is a Cloud Director predefined global or contextual navigation/menu placeholder, 
which a UI plugin will use to attach itself to and be used for navigation/plugin initialization. 
There is a list of extension points, one can pick from.

Here are the different types of extension points:
- [Action type extension point](#action-type-extension-points)
- [Navigation type extension point](#navigation-type-extension-points)
- [Wizard type extension point](#wizard-type-extension-points)

## Configuring extension points in a UI Plugin
The configuration of extension points happens in the `packages/uiPlugin/src/public/manifest.json` file.
To configure an extension points use the following properties:

- `urn` - must be a unique identifier for each extension point.
- `type` - used for defining the particular extension point type
- `name` - name of the extension point
- `description` - description of the extension point
- `component` - a component which will be injected for the particular extension point 
- `module` - a module which will be injected for the particular extension point
- `route` - a route segment which will be used for the injected module - **NOTE: route can be used only when module is defined**
- `render` - `after` - used to define where an action element will be rendered - **NOTE: it works only for action type extension points**. To render after a specific element please supply a selector such as `.vm-description`

**NOTE: You can either define component or module, you can't define both.**

To localize some properties you can use placeholders `"%nav.label%` which you define in `locales`

{% highlight json %}
{
    ...
    "extensionPoints": [
        {
            "urn": "urn:vmware:vcd:component-scope:primary-navigation", 
            "type": "navigation:primary",
            "name": "%nav.label%",
            "description": "%nav.description%",
            "module": "GettingStartedPluginModule",
            "route": "GettingStarted"
        }
    ],
    "locales": {
        "en": {
            "nav.label": "GettingStarted",
            "nav.description": "A basic plugin project"
        }
    }
}
{% endhighlight %}

## Available extension points
The available extension points are demonstrated in the [Showcase plugin][vcd-ext-samples-showcase]{:target="_blank"}

### Action type extension points
Action type extension points are used for registering a route along with an angular component or module contained in the UI Plugin, 
to a newly defined navigation element, in a particular Cloud Director navigation menu.
#### Vm action
This extension point is used for creating an extra action item in a the VM contextual action menu. 
For this particular extension point only a component can be defined.

**Definition**
{% highlight json %}
    {
        "urn": "vmware:vcloud:vm-action:actionName",
        "type": "vm-action",
        "name": "actionDisplayName",
        "description": "description",
        "component": "ComponentName"
    }
{% endhighlight %}

**Code example**
{% highlight typescript %}
...
export class VmBackupActionComponent extends EntityActionExtensionComponent {
    ...
    private result: Subject<{ refreshRequested: boolean }>;

    getMenuEntry(entityUrn: string): Observable<EntityActionExtensionMenuEntry> {
        return Observable.of({
            text: "Backup",
            children: [{
                ...
            },
            {
                ...
            }]
        });
    }

    performAction(menuItemUrn: string, entityUrn: string): Observable<{ refreshRequested: boolean }> {
        ...
    }

    onClose() {
        ...
    }
}
{% endhighlight %}
[Open full code example][code-example-vm-action]{:target="_blank"}

#### VApp action
This extension point is used for creating an extra action item in a the vApp contextual action menu. 
For this particular extension point only a component can be defined.

**Definition**
{% highlight json %}
    {
        "urn": "vmware:vcloud:vapp-action:actionName",
        "type": "vapp-action",
        "name": "actionDisplayName",
        "description": "description",
        "component": "ComponentName"
    }
{% endhighlight %}

**Code example**
{% highlight typescript %}
...
export class VappRestoreActionComponent extends EntityActionExtensionComponent {
    ...
    private result: Subject<{ refreshRequested: boolean }>;

    getMenuEntry(entityUrn: string): Observable<EntityActionExtensionMenuEntry> {
        return Observable.of({
            text: "Restore",
            children: [{
                ...
            },
            {
                ...
            }]
        });
    }

    performAction(menuItemUrn: string, entityUrn: string): Observable<{ refreshRequested: boolean }> {
        ...
    }

    onClose() {
        ...
    }
}
{% endhighlight %}
[Open full code example][code-example-vapp-action]{:target="_blank"}

### Navigation type extension points
Navigation type extension points are used for attaching a callback function within an angular component to a newly defined action element, 
in a particular Cloud Director action menu.

#### Datacenter main navigation
This extension point is used for creating an extra navigation item in the Datacenter main navigation menu.
For this particular extension point either component or module can be defined. If a module is defined, a route definition 
is also required.

**Definition**
{% highlight json %}
    {
        "urn": "vmware:vcloud:datacenter:menuElementName",
        "type": "datacenter-overview",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

[Open sample][code-example-datacenter-main]{:target="_blank"}

#### Primary navigation
This extension point is used for creating an extra navigation item in the Primary navigation menu.
For this particular extension point only module can be defined. Therefor a route definition is also required.

**Definition**
{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:primary-navigation:menuElementName",
        "type": "navigation:primary",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "module": "moduleName", //module only
        "route": "routeName" //root route of the module
    }
{% endhighlight %}

#### Applications navigation
This extension point is used for creating an extra navigation item in the Applications navigation menu.
For this particular extension point either component or module can be defined. If a module is defined, a route definition 
is also required.

**Definition**
{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:applications:menuElementName",
        "type": "navigation:applications",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

[Open sample][code-example-primary]{:target="_blank"}

#### Datacenter extension points
For these particular extension points either component or module can be defined. If a module is defined, a route definition 
is also required.

##### Compute
This extension point is used for creating an extra navigation item in the Datacenter compute navigation menu.

**Definition**
{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-compute:menuElementName",
        "type": "navigation:datacenter:compute",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

[Open sample][code-example-datacenter-compute]{:target="_blank"}

##### Network
This extension point is used for creating an extra navigation item in the Datacenter network navigation menu.

**Definition**
{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-network:menuElementName",
        "type": "navigation:datacenter:network",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

[Open sample][code-example-datacenter-network]{:target="_blank"}

##### Storage
This extension point is used for creating an extra navigation item in the Datacenter storage navigation menu.

**Definition**
{% highlight json %}
    {
        "urn": "urn:vmware:vcd:component-scope:datacenter-storage:menuElementName",
        "type": "navigation:datacenter:storage",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //provide component or module - if module is provided, then route is also needed
        "module" : "moduleName",
        "route" : "routeName" //root route of the module
    }
{% endhighlight %}

[Open sample][code-example-datacenter-storage]{:target="_blank"}

### Wizard type extension points
These extension points in a way combine navigation type and action type extension points. The plugin is rendered as a page in 
particular wizard, however it also provides an action handler, for completing the wizard step.

#### Vapp Create
This extension point is used for creating an extra page in all create vApp wizards.
For this particular extension point only a component can be defined.

**Definition**
{% highlight json %}
    {
        "urn": "vmware:vcloud:vapp:create", //page in create vapp wizard
        "type": "create-vapp",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //component only
        "render": {
            "after": ".vapp-name-extension-point" //for now this is the only option
        }
    }
{% endhighlight %}

**Code example**
{% highlight typescript %}
...
export class VappCreateWizardExtensionPointComponent extends WizardExtensionComponent<any, any, any> {
    performAction(payoad: string, returnValue: string, error: any) {
        console.log("[vApp Create Wizard Extension Point]", payoad, returnValue, error);
    }
}
{% endhighlight %}
[Open sample][code-example-vapp-create]{:target="_blank"}

#### VM Create
This extension point is used for creating an extra page in all create VM wizards.
For this particular extension point only a component can be defined.

**Definition**
{% highlight json %}
    {
        "urn": "vmware:vcloud:vm:create", //page in create vm wizard
        "type": "create-vm",
        "name": "menuElementDisplayName",
        "description": "menuElementDescription",
        "component": "componentName", //component only
        "render": {
            "after": ".vm-description" //for now this is the only option
        }
    }
{% endhighlight %}

**Code example**
{% highlight typescript %}
...
export class VmCreateWizardExtensionPointComponent extends WizardExtensionComponent<any, any, any> {
    performAction(payoad: string, returnValue: string, error: any) {
        console.log("[VM Create Wizard Extension Point]", payoad, returnValue, error);
    }
}
{% endhighlight %}
[Open sample][code-example-vm-create]{:target="_blank"}

#### Organization Create
This extension point is used for adding an extra form fields inside the create Organization dialog,
the extra field could has it's own validation, until your validation don't pass the user won't be able to create organization.
For this particular extension point only a component can be defined.

**Definition**
{% highlight json %}
    {
        "urn": "vmware:vcloud:org:create", //unique identifier
        "type": "create-org",
        "name": "Extension Point Name",
        "description": "Extension Point Description",
        "component": "componentName", //component only
        "render": {
            "after": ".description" //for now this is the only option
        }
    }
{% endhighlight %}

**Code example**
{% highlight typescript %}
...
export class OrgCreateWizardExtensionPointComponent extends WizardExtensionWithValidationComponent<any, any, any> implements OnDestroy {
    form: FormGroup;
    
    private stateSubject = new BehaviorSubject<{
        isValid: boolean
    }>(null);
    private stateObs = this.stateSubject.asObservable();
    
    constructor(
        private fb: FormBuilder,
    ) {
        super();

        this.form = this.fb.group({
            "example": new FormControl(null, Validators.required)
        });
        this.stateSubject.next({
            isValid: this.form.valid
        });
        this.setState();
    }

    ngOnDestroy() {
        console.log("[OrgCreateWizardExtensionPointComponent] Destroyed!");
    }

    performAction(payload: string, returnValue: string, error: any) {
        console.log("[Org Create Wizard Extension Point]", payload, returnValue, error);
    }

    setState() {
        this.form.statusChanges.subscribe(() => {
            this.stateSubject.next({
                isValid: this.form.valid
            });
        });
    }

    getState(): Observable<WizardExtensionState> {
        return this.stateObs;
    }
}
{% endhighlight %}
[Open sample][code-example-vm-create]{:target="_blank"}

[vcd-ext-samples-showcase]: https://www.vmware.com/products/cloud-director.html
[code-example-vm-action]: https://github.com/vmware-samples/vcd-ext-samples/blob/showcase-plugin/src/main/actions/vm.backup.action.component.ts
[code-example-vapp-action]: https://github.com/vmware-samples/vcd-ext-samples/blob/showcase-plugin/src/main/actions/vapp.restore.action.component.ts
[code-example-datacenter-main]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main/datacenter-overview
[code-example-datacenter-compute]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main/datacenter-compute
[code-example-datacenter-network]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main/datacenter-network
[code-example-datacenter-storage]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main/datacenter-storage
[code-example-primary]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main
[code-example-vapp-create]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main/create-vapp
[code-example-vm-create]: https://github.com/vmware-samples/vcd-ext-samples/tree/showcase-plugin/src/main/create-vm