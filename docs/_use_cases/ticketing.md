---
layout: default
title:  "Ticketing"
description: "This tutorial uses a Ticketing application example using the vCD Extensibility SDK"
hasMore: true
labels: 
  - name: Defined Entities
    iconShape: objects
    link: /docs/defined_entities_intro
  - name: UI Plugins
    iconShape: plugin
    link: /docs/ui_plugins/overview
category: Use Cases
order: 1
permalink: /use_cases/ticketing/
---
# Ticketing

This tutorial uses a Ticketing application example. Its purpose is to get you introduced to the essentials
of using the [vCD Extensibility SDK][vcd-ext-sdk] to develop a fully working vCloud Director Plugin.

You will be introduced to:
- How to seed a vCD plugin project
- How to define and use Defined Entities
- How to develop the UI
- How to deploy the plugin in vCD

## Prerequisites

To be able to fully understand the tutorial, you may want to gain some basic knowledge in advance, about the following:
- [Clarity Design System][clarity-design]
- [VCD UI Common Components][ui-components]

## Ticketing application overview

The ticketing functionality example includes:
- Paginated list of tickets
- New action
- Delete action
- Edit action

## Creating the ticketing plugin project

To create the plugin project, you need to install the VCD Extensibility CLI as a global npm package

`npm i -g @vcd/ext-cli`

Once the package is available, open a terminal, go to your desired directory and run

`vcd-ext new ticketing`

Then you will have to go through a couple of setup steps

`? Your solution name (ticketing)` Either press enter or type in a different name

`? Specify first version (0.0.1)` Either press enter or type in a different version

`? Specify vendor name` Type in vendor name, for the ticketing example we type in `vmware`

`? Specify vendor link (http://example.com)` Either press enter or type in a different vendor link, for the ticketing example we press enter

`? Specify solution license (BSD-2-Clause)` Either press enter or type in a different license type, for the ticketing example we press enter

`? Select extensibility elements (Press <space> to select, <a> to toggle all, <i> to invert selection) 
 ❯◯ Defined Entities
  ◯ UI Plugin`
  
You need to select which projects you want the CLI to generate in the mono repo. For the ticketing example we select `Defined Entities` and `UI Plugin` and press enter

`? Defined Entities:element name (types)` Either press enter or type in a different Defined Entities project name, for the ticketing example we press enter

`? UI Plugin:element name (uiPlugin)` Either press enter or type in a different UI Plugin project name, for the ticketing example we press enter

Once the CLI project structure generation process completes, open the project folder in your favorite IDE and the structure should look like this:

![Monorepo structure]({{ site.baseurl }}/assets/images/mono-repo-structure.png)

The Defined Entity project is the place where you will define your custom entities. 
Once the project is build and deployed to the VCD backend, the entities then can be generally 
used by the UI for CRUD operations. 

The UI Plugin project is a self-contained Angular application, which can be locally hosted for development purposes. 
The UI Plugin can be build and deployed to a VCD instance at any time.

## Running the example empty project

To begin with, you will have bare minimum UI Plugin, which you can build and host locally to verify that the 
seeding of the monorepo plugin project was successful. To verify that, do the following

`vcd-ext login userAliasName http://cell.url.com/cloudapi username@tenantName password`

This CLI command will log in using the provided cell url as a tenant user. A session will be created and 
the token will be stored locally. One thing to pay attention to is the .env folder. Notice that at this point 
the folder contains the following files

![Env folder pre auth]({{ site.baseurl }}/assets/images/env-folder-pre-auth.png)

To host the UI plugin locally run

`npm run start`

The plugin is compiled and hosted as an Angular app inside a VCD simulator container under `localhost`. 
Notice that now the .env folder contains two more files - `proxy.conf.runtime.json` and `environment.runtime.json`.
They are both generated based on the templates in the folder, using the previously cached login session using the 
`vcd-ext login` CLI command. The `environment.runtime.json` file contains authentication information and the `proxy.conf.runtime.json` 
contains proxy configuration for the VCD APIs the plugin will be using. Going to localhost in your browse you should see 
the following example

![Initial UI]({{ site.baseurl }}/assets/images/initial-ui-plugin-example.png)

## Implementing the Ticketing

In the following section you will find Ticketing plugin code guidance and implementation details. Only the essential bits 
of code will be discussed in details. For the rest of the source code you will have to refer to the 
[Ticketing example repository][ticketing-example-repo] containing the complete implementation. 


### Implementing the Defined Entities

Go to `ticketing/packages/types/src` and create a `Ticket.ts` file with the following content

{% highlight typescript%}
/**
 * A definition of a ticket entity.
 * @definedEntityType
 */
export class Ticket {
    type: TicketType;
    description: string;
    status: TicketStatus;
}

export const enum TicketType{
    SoftwareIssue = "SoftwareIssue",
    HardwareIssue = "HardwareIssue"
}

export const enum TicketStatus{
    Open = "Open",
    Closed = "Closed"
}
{% endhighlight %}

Pay attention to this bit `@definedEntityType` in the comment marking the Ticket class as a defined entity. This is crucial,
because only the marked classes will later be deployed as defined entities.

Now add `export * from "./Ticket"` to the index.ts 

Go to `types/package.json` and change the name of the package from `types` to `ticketing-types` for convenience.

Now add the `ticketing-types` module as a dependency in the `uiPlugin` project. Make sure you add
`"dependencies": {
  "ticketing-types": "0.0.1"
},`
inside `uiPlugin/package.json`

Then run `npm run build` followed by `npm run bootstrap` and now you will be able to reference the `types` module 
inside the UI Plugin project.

### Implementing the UI Plugin

In the UI implementation we will be using [Clarity Design System][clarity-design] and [VCD UI Common Components][ui-components] which we 
mentioned in the prerequisite section.

#### API Client
To begin with, we will start building an api client service, which we will utilize for VCD api calls. Create a 
`uiPlugin/src/main/api/api-client.service.ts` file. The main structure will be

{% highlight typescript %}
...imports...
export const CLOUD_API = "cloudapi";
export const CLOUD_API_VERSION = "1.0.0";
export const CLOUD_API_ENDPOINT = `${CLOUD_API}/${CLOUD_API_VERSION}/`;
export const TICKET_TYPE_VERSION = "0.0.1";
export const TICKET_TYPE_ID = `urn:vcloud:type:vmware:ticket:${TICKET_TYPE_VERSION}`;

@Injectable()
export class ApiClientService {

    constructor(private client: VcdApiClient) {
    }
}
{% endhighlight %}

Before we start implementing the service, it will be nice to have some helper models which we will build ourselves, for better utilization 
of the API response. Create `uiPlugin/src/main/api/models/DefinedEntityModel.ts` and `uiPlugin/src/main/api/models/PaginationModel.ts` containing

{% highlight typescript %}
import {ResourceType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5/ResourceType";
import {Navigable} from "@vcd/sdk";

export interface DefinedEntity<T> extends ResourceType{
    entity: T;
    entityType: string;
    externalId: string;
    id: string;
    name: string;
    org: EntityReference;
    owner: EntityReference;
    state: string;
    navigable: Navigable;
}

export interface EntityReference {
    name: string;
    id: string;
}
{% endhighlight %}
{% highlight typescript %}
import {ResourceType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

export interface Pagination<T> extends ResourceType{
    resultTotal: number;
    pageCount: number;
    page: number;
    pageSize: number;
    associations: null;
    values: T[];
}
{% endhighlight %}

These are DTOs we will be using for handling Defined entities and pagination. Now let's continue with adding CRUD operations, 
by adding the following functions to `ApiClientService`.

##### Adding **Create** action.

{% highlight typescript %}
    public createTicket(ticket: Ticket): Promise<TaskType> {
        return this.client.createAsync(
            CLOUD_API_ENDPOINT + `entityTypes/${TICKET_TYPE_ID}`,
            {
                name : ticket.type,
                entity: ticket
            } as DefinedEntity<Ticket>
        ).toPromise();
    }

    public resolveTicket(ticketId: string){
        return this.client.createSync(
            CLOUD_API_ENDPOINT + `entities/${ticketId}/resolve`,
            null
        ).toPromise();
    }
{% endhighlight %}

Notice that after the `createTicket` function we've also added `resolveTicket`. For a Defined entity to become "available" 
after creation, we will need to resolve it. For the current version of `Defined Entities`, resolving needs to be handled 
from our side. For simplicity, for this tutorial we won't go into details why this action is required.

##### Adding **Read** actions.

{% highlight typescript %}
    public getTicket(ticketId: string): Promise<DefinedEntity<Ticket>> {
            return this.client.get(CLOUD_API_ENDPOINT + `entities/${ticketId}`)
                .toPromise() as Promise<DefinedEntity<Ticket>>;
    }

    public getTickets(pageSize: number,
                      page: number,
                      sort: {
                          field: string;
                          reverse?: boolean;
                      },
                      customFilters: string[]):
        Promise<Pagination<DefinedEntity<Ticket>>> {

            return this.client.get(CLOUD_API_ENDPOINT + `entities/types/vmware/ticket/${TICKET_TYPE_VERSION}?pageSize=${pageSize}&page=${page}`)
                .toPromise() as Promise<Pagination<DefinedEntity<Ticket>>>;
    }
{% endhighlight %}

##### Adding **Update** action.
{% highlight typescript %}
    public updateTicket(definedEntity: DefinedEntity<Ticket>): Promise<DefinedEntity<Ticket>> {
        return this.client.updateSync(CLOUD_API_ENDPOINT + `entities/${definedEntity.id}`, definedEntity)
            .toPromise() as Promise<DefinedEntity<Ticket>>;
    }
{% endhighlight %}

##### Adding **Remove** action.
{% highlight typescript %}
    public removeTicket(ticket: Navigable): Promise<TaskType> {
        return this.client.removeItem(
            ticket
        ).toPromise();
    }
{% endhighlight %}

#### Ticketing service
For this example we will implement a `uiPlugin/src/main/ticketing/ticketing.service.ts` service for some abstraction, 
over the `ApiClientService`. For implementation details please refer to [Ticketing example repository][ticketing-example-repo].

So far, the project folder structure should look like this

![Monorepo structure]({{ site.baseurl }}/assets/images/mono-repo-structure-2.png)

#### A few words about [@vcd][npm-vcd-scope] npm scope
The [@vcd][npm-vcd-scope] scope contains a collection of publicly available packages, created from different components used in 
[VMware Cloud Director's][vcd] UI. Therefore, we can take advantage of them when creating our plugin, to get as close as possible 
to the original VCD UI UX.

**Packages used in the ticketing example**
- @vcd/ui-components
- @vcd/sdk
- @vcd/i18n
- @vcd/bindings

##### VCD UI Common Components
Before we continue with the UI implementation, it is important to understand the significance of using the [VCD UI Common Components][ui-components] library.
One of the main goals of this library is to allow plugin developers to create plugins with VCD Unified UX. This is why, 
it is important to always try using existing UI Components and utilities from [VCD UI Common Components][ui-components], before
proceeding with custom implementations.

##### VCD i18n
This is package is used for internationalization and can be directly used in our plugin. There are two main ways by which 
this package can be utilized.

**Defining i18n key-value pairs**

Upon project seed generation, an i18n English file will be created under `uiPlugin/src/public/assets/i18n/en.json` 
This is where you can add any key-value pair, for instance
{% highlight json %}
{
    "ticketing.header" : "Ticketing" //without attributes.
    "ticketing.name" : "Ticketing - {0}" //with attributes
}
{% endhighlight %}
 
and use as follows

**Directly in HTML as an Angular pipe**
{% highlight html %}
    <h3>{% raw %}{{"ticketing.header" | translate}}{% endraw %}</h3>
    <h4>{% raw %}{{"ticketing.name" | translate : "Software issue ticket"}}{% endraw %}</h4>
{% endhighlight %}

**Inside a component as a service**
{% highlight typescript %}
    headerTitle: string;
    headerName: string;
    constructor(private translationService: TranslationService) {
        this.headerTitle = this.translationService.translate("ticketing.header");
        this.headerName = this.translationService.translate("ticketing.name", ["Software issue ticket"]);
    }
{% endhighlight %}

##### VCD Bindings
The bindings package is containing most of VCD API related models. We can utilize them when working with the API. 

#### Delete confirmation modal
For the delete action we will implement a delete confirmation modal under `uiPlugin/src/main/ticketing/delete-modal`. 
For its implementation we will be using [Clarity Modal][clarity-modal]. 
At the end, the delete modal will look like this
![Initial UI]({{ site.baseurl }}/assets/images/delete-confirmation-modal.png)

For further implementation details please refer to the [Ticketing example repository][ticketing-example-repo].

#### Create and Update Ticket modal
For the ticketing example we will create a single modal, sharing both **Create** and **Update** action. Upon using 
**Create** action you will get an empty modal with Create button. Upon selecting a ticked and using **Update** action, 
you will get a populated modal with a Save button.

Go to `uiPlugin/src/main/ticketing/` in your terminal and run `ng g c ticket-modal`. Delete the spec file, we won't need it.

For the implementation we will be using [Reactive Forms][reactive-forms] together with some components from `@vcd/ui-componets`.

##### The html template

{% highlight html %}
<clr-modal
        clrModalSize="xl"
        [(clrModalOpen)]="opened"
        [clrModalClosable]="false">
    <h3 *ngIf="editTicket"
        class="modal-title">{% raw %}{{"ticketing.modal.edit.title" | translate : editTicket.id.split(":").pop()}}{% endraw %}</h3>
    <h3 *ngIf="!editTicket" class="modal-title">{% raw %}{{"ticketing.modal.add.title" | translate}}{% endraw %}</h3>
    <div class="modal-body">
        <form [formGroup]="ticketForm">
            <vcd-form-select
                    [formControlName]="ticketFormNames.TYPE"
                    [label]="'ticketing.modal.input.type' | translate"
                    [options]="typeOptions"
                    [required]="true">
            </vcd-form-select>
            <clr-textarea-container class="description">
                <label>{% raw %}{{"ticketing.modal.input.description" | translate}}</label>
                <textarea class="description-text-area" clrTextarea formControlName="{{ticketFormNames.DESCRIPTION}}" name="description" required></textarea>
                <clr-control-error *clrIfError="'required'">
                    {% raw %}{{"ticketing.modal.input.description.required" | translate}}{% endraw %}
                </clr-control-error>
            </clr-textarea-container>
            <vcd-form-select
                    [formControlName]="ticketFormNames.STATUS"
                    [options]="statusOptions"
                    [label]="'ticketing.modal.input.status' | translate"
                    [required]="true">
            </vcd-form-select>
        </form>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="close()">
            {% raw %}{{"ticketing.modal.button.cancel" | translate}}{% endraw %}
        </button>
        <button [disabled]="ticketForm.invalid" type="submit" class="btn btn-primary" (click)="submit()">
            {% raw %}{{editTicket ? ("ticketing.modal.button.save" | translate) : ("ticketing.modal.button.add" | translate)}}{% endraw %}
        </button>
    </div>
</clr-modal>
{% endhighlight %}

Note the combination between Clarity components and vCD Common Components, for instance [clr-modal][clarity-modal], 
[clr-textarea-container][clarity-text-area] and [vcd-form-select][ui-component-vcd-select]. The modal in **Create** mode looks like this 

![Ticketing overview]({{ site.baseurl }}/assets/images/new-ticket-modal.png)

##### The typescript file
For the typescript implementation in `ticket-modal.component.ts` please refer to [Ticketing example repository][ticketing-example-repo], 
since there isn't anything particularly specific to discuss there.

#### Ticketing main page
The main page will mainly consist of [VCD UI Common Components][ui-components].

##### The html template
{% highlight html %}
<div class="plugin-wrapper">
    <h4>{% raw %}{{"ticketing.header" | translate}}{% endraw %}</h4>
    <vcd-error-banner *ngIf="errorMessage" [(errorMessage)]="errorMessage"></vcd-error-banner>
    <vcd-datagrid *ngIf="columns"
                  #datagrid
                  [emptyGridPlaceholder]="'ticketing.grid.empty' | translate"
                  [gridData]="gridData"
                  (gridRefresh)="refresh($event)"
                  [columns]="columns"
                  [pagination]="paginationInfo"
                  [selectionType]="selectionType.Single"
                  [preserveSelection]="true"
                  [(datagridSelection)]="selected"
                  [actions]="actions"
                  paginationTranslationKey="ticketing.grid.pagination"
    >
    </vcd-datagrid>
</div>
<ticket-modal
    #ticketModal
    *ngIf="this.columns"
    (ticketEdited)="onEditConfirm($event)"
    (ticketSubmitted)="onCreateConfirm($event)"></ticket-modal>
<delete-modal #deleteModal></delete-modal>
{% endhighlight %}

For the main page we are using the [vcd-datagrid][ui-component-vcd-grid] and [vcd-error-banner][ui-component-vcd-error-banner] 
from the vCD Common Components. Here we also declare the previously created `ticket-modal` and `delete-modal`.

The `vcd-error-banner` is used to handle any request errors and is displayed as such

![Ticketing overview]({{ site.baseurl }}/assets/images/error-banner.png)

The `vcd-datagrid` is used to display the list of created tickets and is displayed as such

![Ticketing overview]({{ site.baseurl }}/assets/images/ticketing-overview-1.png)

Pay attention to the actions menu - it is build in the `vcd-datagrid` which accepts and definition of actions collection 
as such `[actions]="actions"`. The initialization of the actions is in the typescript file.

##### The typescript file
For implementation details in the `ticketing.component.ts` file, please refer to [Ticketing example repository][ticketing-example-repo]. 
For further understanding of the `vcd-grid` configuration refer to [vCD UI Components Datagrid][ui-component-vcd-grid]. 
First lest pay attention to declarations and grid configuration. Please refer to the comments in the code

{% highlight typescript %}

...imports...

@Component({
    selector: "ticketing-plugin",
    templateUrl: "./ticketing.component.html",
    styleUrls: ['./ticketing.component.scss'],
    host: {'class': 'content-container'}
})
export class TicketingComponent implements OnInit, OnDestroy {
    private _subscriptions: SubscriptionTracker = new SubscriptionTracker(this);

    //Here we declare all child components such as modals
    @ViewChild("ticketModal", {static: false}) private ticketModal: TicketModalComponent;
    @ViewChild("deleteModal", {static: false}) private deleteModal: DeleteModalComponent;
    @ViewChild("datagrid", {static: false}) private datagrid: DatagridComponent<any>;

    errorMessage: string;
    selectionType = GridSelectionType;
    selected: DefinedEntity<Ticket>[] = [];
    tickets: DefinedEntity<Ticket>[] = [];

    //Here we declare the vcd-grid pagination configuration 
    paginationInfo: PaginationConfiguration = {
        pageSize: 5,
        pageSizeOptions: [5, 10],
        shouldShowPageNumberInput: true,
        shouldShowPageSizeSelector: true,
    };

    columns: GridColumn<DefinedEntity<Ticket>>[] = null;

    //Injecting Ticketing and Translation service
    constructor(private ticketingService: TicketingService,
                private translationService: TranslationService) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        //Pay attention that we want to initialize the grid afer we are sure the bundle with translation
        //strings is loaded. Currently this is the way of doing it:
        //Translating a single key in an async manner, once the bundle is available, the service will notify us.
        this._subscriptions.subscribe(this.translationService.translateAsync("ticketing.grid.id"), (a) => {
            this.initGridColumns();
        });
    }

    initGridColumns() {
        
        //Here we declare the vcd-grid columns configuration 
        this.columns = [
            {
                displayName: this.translationService.translate("ticketing.grid.id"),
                renderer: (ticket) => ticket.id.split(":").pop()
            },
            {
                displayName: this.translationService.translate("ticketing.grid.type"),
                renderer: "entity.type"
            },
            {
                displayName: this.translationService.translate("ticketing.grid.description"),
                renderer: "entity.description"
            },
            {
                displayName: this.translationService.translate("ticketing.grid.status"),
                renderer: "entity.status"
            },
        ];
    }
...
}
{% endhighlight %}
 
Now let's continue examining the parts of code where we handle the `vcd-grid` requests

{% highlight typescript %}
...
    //Here we store previous grid state, you will understand why in the next code section
    private previousGridState: GridState<DefinedEntity<Ticket>>;

    //This is the method bound to the (gridRefresh) event
    async refresh(eventData: GridState<DefinedEntity<Ticket>>) {
        //storing current state
        this.previousGridState = eventData;

        //NOTE - even though we've shown how to extract sorting and filtering information from the grid
        //we currently don't support these features in the Defined entities list 
        let sort: {
            field: string;
            reverse?: boolean;
        } = null;

        if (eventData.sortColumn) {
            sort = {
                field: eventData.sortColumn.name,
                reverse: eventData.sortColumn.reverse
            };
        }

        //activating grid loading indicator
        if (this.datagrid) this.datagrid.isLoading = true;
        let tickets: Pagination<DefinedEntity<Ticket>>;
        try {
            //Here we are handling the request, upon grid state change, passing pagination, sorting and filtering info
            tickets = await this.ticketingService.fetchTickets(
                eventData.pagination.itemsPerPage,
                eventData.pagination.pageNumber,
                sort,
                eventData.filters
            );
        } catch (e) {
            //Here we catch and display any errors in the `vcd-error-banner`  that we've mentioned previously
            this.errorMessage = e.message || e.details || e;
        }finally {
            //deactivating grid loading indicator
            if (this.datagrid) this.datagrid.isLoading = false;
        }

        this.tickets = tickets.values;

        this.gridData = {
            items: this.tickets,
            totalItems: tickets.resultTotal,
        };
    }
...
}
{% endhighlight %}

And finally let's see how the rest of the CRUD actions, displayed above the grid are handled
{% highlight typescript %}
...
    //Here's the getter that is bound to the `[actions]` grid property 
    public get actions(): ActionItem<DefinedEntity<Ticket>, any>[] {
        //Here we defined the list of actions
        return [
            {
                textKey: "ticketing.action.new", //Action translation key
                handler: () => { //Action handler
                    this.ticketModal.open();
                },
                availability: (selection) => { //Action availability -> New action is always available
                    return true;
                },
                class: "btn btn-sm btn-link",
                actionType: ActionType.STATIC_FEATURED //The type of action, for more information please refer to the ActionType enum
            },
            {
                textKey: "ticketing.action.delete",
                handler: (selection) => { 
                //Here in the handler we can pass the list of selected items 

                    if (!selection) return;
                    
                    //We take the first (and only) selected item (currently the list is in single selection mode)
                    const ticket = selection[0];

                    //Initialize the delete modal
                    const deleteModalConfig = {
                        header: this.translationService.translate("ticketing.deleteModal.header",
                            [ticket.id]),
                        body: this.translationService.translate("ticketing.deleteModal.body",
                            [ticket.id]),
                        deleteHandler: this.onDeleteConfirm.bind(this),
                        payload: ticket
                    };

                    this.deleteModal.open(deleteModalConfig);
                },
                availability: (selection) => {
                    //Please note, that the availability here is calculated based on navigable property 
                    //of type Navigable. It contains the links provided by the Hateoas API. In short, if link with the provided
                    //rel type is present, then the action of this type is available. For further information, 
                    //please take a look at the canPerformAction method and read about vCD Cloud API
                    return this.ticketingService.canPerformAction(selection[0].navigable, LinkRelType.remove);
                },
                class: "btn btn-sm btn-link",
                actionType: ActionType.CONTEXTUAL_FEATURED
            },
            {
                textKey: "ticketing.action.edit",
                handler: (selection) => {

                    if (!selection) return;

                    const ticket = selection[0];

                    this.ticketModal.open(ticket);
                },
                availability: (selection) => {
                    return this.ticketingService.canPerformAction(selection[0].navigable, LinkRelType.remove);
                },
                class: "btn btn-sm btn-link",
                actionType: ActionType.CONTEXTUAL_FEATURED
            },
        ];
    }

    //Create handler
    private async onCreateConfirm(ticket: Ticket) {
        this.datagrid.isLoading = true;
        try {
            await this.ticketingService.createTicket(ticket)
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        } finally {
            this.datagrid.isLoading = false;
        }
        await this.refresh(this.previousGridState);

    }
    
    //Edit handler
    private async onEditConfirm(definedEntity: DefinedEntity<Ticket>) {
        this.datagrid.isLoading = true;
        try {
            await this.ticketingService.updateTicket(definedEntity);
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        } finally {
            this.datagrid.isLoading = false;
        }
        await this.refresh(this.previousGridState);
    }

    //Delete handler
    private async onDeleteConfirm(definedEntity: DefinedEntity<Ticket>) {
        this.datagrid.isLoading = true;
        try {
            await this.ticketingService.removeTicket(definedEntity.navigable);
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        } finally {
            this.datagrid.isLoading = false;
        }
        await this.refresh(this.previousGridState);
    }
...
{% endhighlight %}


[vcd-ext-sdk]: https://github.com/vmware/vcd-ext-sdk
[clarity-design]: https://clarity.design
[ui-components]: https://vmware.github.io/vmware-cloud-director-ui-components/home
[ticketing-example-repo]: https://github.com/vmware-samples/vcd-ext-samples/tree/guide-examples/ticketing
[clarity-modal]: https://clarity.design/angular-components/modal/
[npm-vcd-scope]: https://www.npmjs.com/search?q=%40vcd
[vcd]: https://www.vmware.com/products/cloud-director.html
[reactive-forms]: https://angular.io/guide/reactive-forms
[clarity-text-area]: https://clarity.design/angular-components/textarea/
[ui-component-vcd-grid]: https://vmware.github.io/vmware-cloud-director-ui-components/datagrid/documentation
[ui-component-vcd-error-banner]: https://vmware.github.io/vmware-cloud-director-ui-components/errorBanner/documentation
[ui-component-vcd-select]: https://vmware.github.io/vmware-cloud-director-ui-components/formSelect/documentation