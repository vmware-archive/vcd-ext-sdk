/** vcloud-director-ui-extension-sample-ticketing-phase4
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Ticket} from './ticket'

export let TICKETS: Ticket[] = [
  {
    "ticket_id": "111",
    "ticket_msg": "I am opening a ticket",
    "status": "Open"
  },
  {
    "ticket_id": "112",
    "ticket_msg": "My server is slow!",
    "status": "Closed"
  },
  {
    "ticket_id": "113",
    "ticket_msg": "Please open port 22 for vm labeled ABC",
    "status": "Open"
  }
];
