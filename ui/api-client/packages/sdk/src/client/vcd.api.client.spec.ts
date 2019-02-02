import { TestBed, inject, async } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { LoggingInterceptor } from "./logging.interceptor";
import { RequestHeadersInterceptor } from "./request.headers.interceptor";
import { VcdApiClient } from "./vcd.api.client";
import { VcdHttpClient } from "./vcd.http.client";
import { AuthTokenHolderService, API_ROOT_URL } from "../common";
import { SupportedVersionsType } from "@vcd/bindings/vcloud/api/rest/schema/versioning";
import { SessionType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

// verifies that the GET api/versions endpoint is called exactly once, and returns the provided response
function handleVersionNegotiation(versionResponse: SupportedVersionsType, httpMock: HttpTestingController): void {
    const req: TestRequest[] = httpMock.match("rootUrl/api/versions");
    expect(req.length).toBe(1);
    req[0].flush(versionResponse);
}

// verifies that the GET api/session endpoint is called exactly once, and returns a mock SessionType response
function handleSessionLoad(httpMock: HttpTestingController): void {
    const req: TestRequest[] = httpMock.match("rootUrl/api/session");
    expect(req.length).toBe(1);
    req[0].flush(<SessionType> {});
}

describe("API client version pre-request validation", () => {
    let httpClient: VcdHttpClient;
    let httpMock: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                LoggingInterceptor,
                RequestHeadersInterceptor,
                VcdHttpClient
            ]
        });

        httpClient = TestBed.get(VcdHttpClient);
        httpMock = TestBed.get(HttpTestingController);
    }));

    afterEach(() => {
        httpMock.verify();
    })

    it("negotiates with a server that supports most preferred/latest version", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.get("api/test").subscribe(() => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("negotiates with server that fulfills a less preferred but valid version", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.slice(1).map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.get("api/test").subscribe(() => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[1]);
        })

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("negotiates with server that does not have a version of the API that this client supports", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: [{ version: "15.0", mediaTypeMapping: [], deprecated: false }]
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.get("api/test").subscribe(() => {
            fail('expected error');
        }, (error) => {
            expect(error);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
    });

    it("verifies that negotation only happens once for multiple API calls", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.get("api/test").subscribe(() => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        })

        client.get("api/test").subscribe(() => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        })

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        expect(httpMock.match("rootUrl/api/test").length).toBe(2);
    });

    it("verifies that explicit version request should bypass negotiation", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.setVersion("30.0");
        client.get("api/test").subscribe(() => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS["30.0"]);
        });

        httpMock.expectNone("rootUrl/api/versions");
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });
});