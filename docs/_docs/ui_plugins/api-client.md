---
layout: default
title:  "API Client"
category: UI Plugins
description: "API Client library"
catOrder: 4
order: 7
hasMore: true
labels: [UI Plugins]
permalink: /docs/ui_plugins/api-client
---
# API Client
The [@vcd/angular-client][api-client] is a publicly available package, build specifically for Cloud Director rest API unitization. 
Therefore, we can take advantage of it, to enhance the UI Plugin development experience.

## Authentication example

{% highlight typescript %}
...
ngOnInit(): void {
this.client.login('username', 'org', 'pa$$w0rd').subscribe(() => {
console.log(`logged into ${this.client.organization} as ${this.client.username}`);
});
{% endhighlight %}

## Query example

{% highlight typescript %}
...
export class GettingStartedComponent implements OnInit {
    username: Observable<string>;
    tenant: Observable<string>;

    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string, private client: VcdApiClient) {}

    ngOnInit(): void {
        this.tenant = this.client.organization;
        this.username = this.client.username
        
        this.client.query(Query.Builder.ofType("organization").links(false)).subscribe(results => {
            console.log(results);
        })
    }
}
{% endhighlight %}

For further details please refer to the source of the library: [Angular client][angular-client]

[api-client]: https://www.npmjs.com/package/@vcd/angular-client
[angular-client]: https://github.com/vmware/cloud-director-typescript-clients/tree/main/packages/angular