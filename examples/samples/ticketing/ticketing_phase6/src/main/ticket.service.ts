/** vcloud-director-ui-extension-sample-ticketing-phase6
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Injectable, Inject}    from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import {Ticket} from './ticket';

import {AuthTokenHolderService, API_ROOT_URL} from '@vcd-ui/common';

@Injectable()
export class TicketService {
  private currentOrgId:String;
  private currentUserId:String;
  private headers:{};

  constructor(
    private http:Http,
    authTokenHolderService: AuthTokenHolderService,
    @Inject(API_ROOT_URL) private apiRootUrl: string)
    {
      this.headers = {'headers' : {'x-vcloud-authorization':authTokenHolderService.token, 'Accept':'application/*+xml;version=29.0'}};
    }

  getOrgId(): Observable<String> {
    if (this.currentOrgId) {
      console.log('skipped org id lookup');
      return Observable.of<String>(this.currentOrgId);
    }
    return this.http.get('/api/org', this.headers)
      .map((res:Response) => {
        let dom = parseXml(res.text());
        return dom.getElementsByTagName('Org')[0].getAttribute('href').split('/').slice(-1)[0];
      })
      .do(orgId => this.currentOrgId = orgId);
  }

  getTickets(): Observable<Ticket[]> {
    return this.getOrgId()
      .mergeMap(orgId => {
        return this.http
          .get(`${this.apiRootUrl}/api/org/${orgId}/ticketing`, this.headers)
          .map((res:Response) => parseTickets(res.text()));
      });
  }

  createTicket(description:string): Observable<Ticket>  {
    return this.http
      .post(`${this.apiRootUrl}/api/org/${this.currentOrgId}/ticketing`,
            `<?xml version="1.0" encoding="UTF-8"?><ticket><ticket_msg>${description}</ticket_msg></ticket>`,
            this.headers)
      .map(res => parseTickets(res.text())[0]);
  }

  modifyTicket(ticket_id:string, description:string): Observable<Response> {
    return this.http
      .put(`${this.apiRootUrl}/api/org/${this.currentOrgId}/ticketing/${ticket_id}`,
            `<?xml version="1.0" encoding="UTF-8"?><ticket><ticket_msg>${description}</ticket_msg></ticket>`,
            this.headers)
  }

  deleteTicket(ticket_id:string): Observable<Ticket[]> {
    return this.http
      .delete(`${this.apiRootUrl}/api/org/${this.currentOrgId}/ticketing/${ticket_id}`,
              this.headers)
      .map((res:Response) => parseTickets(res.text()));
  }
}

function parseXml(xml:string) {
   var dom = null;
   if (window.DOMParser) {
      try {
         dom = (new DOMParser()).parseFromString(xml, 'text/xml');
      }
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
      }
      catch (e) { dom = null; }
   }
   else
      alert('cannot parse xml string!');
   return dom;
}

function parseTickets(xml:string) {
  let result:Ticket[] = [];
  if (xml) {
    let dom = parseXml(xml);
    let tickets = dom.getElementsByTagName('ticket');
    for (let i=0; i<tickets.length; i++) {
      let ticket = tickets[i];
      result.push(
        {
          ticket_id: getNodeValue(ticket, 'ticket_id'),
          ticket_msg: getNodeValue(ticket, 'ticket_msg'),
          status: getNodeValue(ticket, 'status')
        }
      )
    }
  }
  return result;
}

function getNodeValue(dom:any, tagname:string) {
  let ret = '';
  if (dom) {
    let elems = dom.getElementsByTagName(tagname);
    if (elems && elems[0] && elems[0].firstChild) {
      ret = elems[0].firstChild.nodeValue;
    }
  }
  return ret;
}
