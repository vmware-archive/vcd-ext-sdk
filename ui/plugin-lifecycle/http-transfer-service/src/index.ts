import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpTransferService, CHUNK_SIZE, PARALLEL_REQUESTS } from "./http-transfer.service";

export * from "./http-transfer.service";

export function transferServiceFactory(httpClient: HttpClient) {
    return new HttpTransferService(httpClient, CHUNK_SIZE, PARALLEL_REQUESTS);
}

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [],
    providers: [{
        provide: HttpTransferService,
        useFactory: transferServiceFactory,
        deps: [HttpClient]
    }]
})
export class VcdHttpTransferServiceModule { }
