import { Component } from "@angular/core";

@Component({
    selector: "<%= dasherize(name) %>",
    templateUrl: "./<%= dasherize(name) %>.component.html",
    host: {'class': 'content-container'}
})
export class <%= classify(name) %>Component {}
