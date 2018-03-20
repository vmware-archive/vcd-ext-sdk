/** vcloud-director-ui-extension-sample-ticketing-phase3
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Route} from '@angular/router';
import {TicketingComponent} from './ticketing.component';

export const ROUTES: Route[] = [
    {
        path: '',
        component: TicketingComponent
    }
];
