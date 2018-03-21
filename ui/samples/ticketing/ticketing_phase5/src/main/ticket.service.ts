/** vcloud-director-ui-extension-sample-ticketing-phase5
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Ticket} from './ticket';
import {TICKETS} from './mock-tickets';

@Injectable()
export class TicketService {
  ticketID = 200;

  getTickets(): Observable<Ticket[]> {
    return Observable.of<Ticket[]>(TICKETS);
  }

  createTicket(description: string): Observable<Ticket[]> {
    this.ticketID += 1
    return Observable.of<Ticket[]>({
      "ticket_id": this.ticketID,
      "ticket_msg": description,
      "status": "Open"
    });
  }

  deleteTicket(ticket_id): Observable<Ticket[]> {
    for (let i=0; i<TICKETS.length; i++) {
      if (TICKETS[i].ticket_id == ticket_id)
      {
        TICKETS.splice(i, 1);
        break;
      }
    }
    return Observable.of<Ticket[]>(TICKETS);
  }
}
