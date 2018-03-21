/** vcloud-director-ui-extension-sample-ticketing-phase5
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

import {Ticket} from './ticket';
import {TicketService} from './ticket.service';

@Component({
  selector: 'ticketing-component',
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.css'],
  host: {'class': 'content-container'},
  providers: [TicketService]
})

export class TicketingComponent implements OnInit {
  tickets: Ticket[];
  selectedTicket: Ticket;
  ticketaddmodal: boolean = false;
  ticketdetailsmodal: boolean = false;

  constructor(private ticketService: TicketService) { }

  getTickets(): void {
    this.ticketService.getTickets().subscribe(tickets => this.tickets = tickets);
  }

  createTicketSubmit(form: NgForm) {
    this.ticketService.createTicket(form.controls['ticketadddesc'].value).subscribe(newticket => {
      this.tickets.push(newticket);
      this.ticketaddmodal = false;
      form.reset();
    });
  }

  createTicketCancel(form: NgForm) {
    this.ticketaddmodal = false;
    form.reset();
  }

  ticketDetailsSubmit(form: NgForm) {
    this.selectedTicket.ticket_msg = form.controls['ticketdetailsdesc'].value;
    this.ticketdetailsmodal = false;
    form.reset();
  }

  ticketDetailsCancel(form: NgForm) {
    this.ticketdetailsmodal = false;
  }

  deleteTicket() {
    this.ticketService.deleteTicket(this.selectedTicket.ticket_id).subscribe(tickets => this.tickets = tickets);
    this.selectedTicket = null;
  }

  ngOnInit(): void {
    this.getTickets();
  }
}
