/** vcloud-director-ui-extension-sample-ticketing-phase2
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Ticket} from './ticket';
import {TICKETS} from './mock-tickets';

@Injectable()
export class TicketService {
  getTickets(): Observable<Ticket[]> {
    return Observable.of<Ticket[]>(TICKETS);
  }
}
