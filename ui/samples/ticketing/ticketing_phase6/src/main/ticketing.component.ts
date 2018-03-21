/** vcloud-director-ui-extension-sample-ticketing-phase6
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
  ticketdatagridloading: boolean = false;
  ticketaddmodal: boolean = false;
  ticketdetailsmodal: boolean = false;

  constructor(private ticketService: TicketService) { }

  getTickets(): void {
    this.ticketdatagridloading = true;
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
      this.ticketdatagridloading = false;
    });
  }

  createTicketSubmit(form: NgForm) {
    this.ticketdatagridloading = true;
    this.ticketaddmodal = false;
    this.ticketService.createTicket(form.controls['ticketadddesc'].value).subscribe(newticket => {
      this.tickets.push(newticket);
      form.reset();
      this.ticketdatagridloading = false;
    });
  }

  createTicketCancel(form: NgForm) {
    this.ticketaddmodal = false;
    form.reset();
  }

  ticketDetailsSubmit(form: NgForm) {
    this.ticketdatagridloading = true;
    this.ticketdetailsmodal = false;
    this.ticketService.modifyTicket(this.selectedTicket.ticket_id, form.controls['ticketdetailsdesc'].value).subscribe(newticket => {
      this.selectedTicket.ticket_msg = form.controls['ticketdetailsdesc'].value;
      form.reset();
      this.ticketdatagridloading = false;
    });
  }

  ticketDetailsCancel(form: NgForm) {
    this.ticketdetailsmodal = false;
  }

  deleteTicket() {
    this.ticketdatagridloading = true;
    this.ticketService.deleteTicket(this.selectedTicket.ticket_id).subscribe(tickets => {
      this.tickets = tickets;
      this.ticketdatagridloading = false;
    });
    this.selectedTicket = null;
  }

  ngOnInit(): void {
    this.getTickets();
  }
}
