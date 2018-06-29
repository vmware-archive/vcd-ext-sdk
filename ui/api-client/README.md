# vCD API Client #
A collection of Typescript libraries for quickly and easily communication with a vCloud Director installation via its API.

## Overview ##
The API client is currently made up of the following packages:

### @vcd/bindings ###
A collection of Typescript objects that represent the vCD API's requests/responses.

### @vcd/sdk ###
An Angular module that provides a REST API client with consistent handling of patterns and behaviors specific to the vCloud REST API.  This module also contains various utilities and tools for things like query and filter management.

## Building ##
### Prerequisites ###
Before the `api-client` packages can be built, the `java/api-schemas` projects must be built.  Generation of the Java API bindings is a prerequisite to generating the Typescript bindings because it is these Java classes that drive the binding generation.  From the `vcd-ext-sdk` project root directory:
```bash
cd java/api-schemas
mvn install
```

Next navigate to the `api-client` folder and generate the bindings.  **Note: these steps only need to be performed when the bindings change.**
```bash
cd ../../ui/api-client
mvn generate-sources
```

### Install ###
At this point, the Typescript source files will be generated in the bindings package, and the `api-client` project can be treated (more or less) like a traditional Node package.  Executing the following 2 commands
```bash
yarn
yarn bootstrap
```
will initialize the top level project, and then initialize and build `@vcd/bindings` and `@vcd/sdk`.

## Using the SDK ##
Create a new Angular project.  [Angular CLI](https://cli.angular.io/) provides a very simple mechanism to get up and running with a new Angular project.  Once you have a project, the SDK and bindings can be added with a few simple steps:
1. Add `@vcd/bindings` and `@vcd/sdk` as project dependencies
```json
// package.json
{
    "dependencies": {
        ...,
        "@vcd/bindings": "<path to api-client/packages/bindings/dist>",
        "@vcd/sdk": "<path to api-client/packages/sdk/dist>",
        ...
    }
}
```
2. Import `VcdSdkModule` into the app module and set `VcdApiClient` as a provider
```js
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    VcdSdkModule
  ],
  providers: [VcdApiClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
3. Inject `VcdApiClient` into a component
```js
constructor(private client: VcdApiClient) {}
```

The SDK is now ready for use.

### Usage examples ###
#### Authenticating ####
If you don't have an existing session, you can create one:
```js
ngOnInit(): void {
    this.client.login('username', 'org', 'pa$$w0rd').subscribe(() => {
      console.log(`logged into ${this.client.organization} as ${this.client.username}`);
    });
```

If you already have an existing session (because you're acting as a UI extension and have access to the authentication token for example) you can simply set the authentication of the client instance to use the Bearer token:
```js
ngOnInit(): void {
    this.client.setAuthentication(bearerToken).subscribe(() => {
      console.log(`logged into ${this.client.organization} as ${this.client.username}`);
    });
```

#### Querying the API ####
The query builder can be used to quickly create API calls that are compatible with the query service:
```js
this.client.query(Query.Builder.ofType('virtualCenter'))).pipe(
    tap(queryResult => console.log(`Virtual centers: ${queryResult.total}`))
).subscribe();
```