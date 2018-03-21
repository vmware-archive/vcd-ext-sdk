/** vcloud-director-ui-extension-sample-about-page
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Route} from '@angular/router';
import {AboutComponent} from './about.component';

export const ROUTES: Route[] = [
    {
        path: '',
        component: AboutComponent
    }
];
