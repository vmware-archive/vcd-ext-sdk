/** vcloud-director-ui-extension-sample-ticketing-phase3
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {CommonModule} from '@angular/common';
import {FormsModule}  from '@angular/forms';
import {Inject, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Store} from '@ngrx/store';
import {EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule} from '@vcd-ui/common';
import {TicketingComponent} from './ticketing.component';
import {ROUTES} from './ticketing.routes';

import {ClarityModule} from 'clarity-angular';

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        I18nModule,
        RouterModule.forChild(ROUTES),
        FormsModule
    ],
    declarations: [
        TicketingComponent
    ],
    bootstrap: [
        TicketingComponent
    ]
})
export class TicketingModule {
    constructor(private appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string) {
        const registration: ExtensionNavRegistration = {
            icon: "view-list",
            path: extensionRoute,
            nameCode: 'nav.ticketing',
            descriptionCode: 'nav.ticketing.description'
        };
        appStore.dispatch(new ExtensionNavRegistrationAction(registration));
    }
}
