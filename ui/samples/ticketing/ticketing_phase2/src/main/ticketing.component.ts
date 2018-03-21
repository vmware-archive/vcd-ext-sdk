/** vcloud-director-ui-extension-sample-ticketing-phase2
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, OnInit} from '@angular/core';

import {Ticket} from './ticket';
import {TicketService} from './ticket.service';

@Component({
  selector: 'ticketing-component',
  templateUrl: './ticketing.component.html',
  host: {'class': 'content-container'},
  providers: [TicketService]
})

export class TicketingComponent implements OnInit {
  tickets: Ticket[];
  selectedTicket: Ticket;

  constructor(private ticketService: TicketService) { }

  getTickets(): void {
    this.ticketService.getTickets().subscribe(tickets => this.tickets = tickets);
  }

  ngOnInit(): void {
    this.getTickets();
  }
}
