import { TestBed, async } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { LoggingInterceptor } from "./logging.interceptor";
import { RequestHeadersInterceptor } from "./request.headers.interceptor";
import { VcdApiClient } from "./vcd.api.client";
import { VcdHttpClient } from "./vcd.http.client";
import { AuthTokenHolderService, API_ROOT_URL } from "../common";
import { SupportedVersionsType } from "@vcd/bindings/vcloud/api/rest/schema/versioning";
import { SessionType, TaskType, EntityReferenceType, QueryResultRecordsType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import { Query } from "../query";
import { ResponseNormalizationInterceptor } from "./response.normalization.interceptor";

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

const MOCK_TASK: TaskType = {
    id: "12345",
    type: "application/vnd.vmware.vcloud.task+json"
}

describe("API client pre-request validation", () => {
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
                ResponseNormalizationInterceptor,
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
        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.setVersion("30.0");
        client.get("api/test").subscribe(() => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS["30.0"]);
        });

        httpMock.expectNone("rootUrl/api/versions");
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("performs validation chain on createAsync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.createAsync("api/test", {}).subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test").flush(MOCK_TASK);
    });

    it("performs validation chain on createSync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        const entity = <EntityReferenceType>{ id: "12345", name: "test", type: "application/vnd.vmware.vcloud.test+json"};
        client.createSync<EntityReferenceType>("api/test", entity).subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(entity.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test").flush(entity);
    });

    it("performs validation chain on deleteAsync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.deleteAsync("api/test").subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test").flush(MOCK_TASK);
    });

    it("performs validation chain on deleteSync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.deleteSync("api/test").subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("performs validation chain on updateAsync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        client.updateAsync("api/test", {}).subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test").flush(MOCK_TASK);
    });

    it("performs validation chain on updateSync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        const entity = <EntityReferenceType>{ id: "12345", name: "test", type: "application/vnd.vmware.vcloud.test+json"};
        client.updateSync<EntityReferenceType>("api/test", entity).subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(entity.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test").flush(entity);
    });

    it("performs validation chain on query", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const client = new VcdApiClient(httpClient, AuthTokenHolderService, API_ROOT_URL.toString());
        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []}
        client.query(Query.Builder.ofType("test")).subscribe(result => {
            expect(client.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.total).toBe(mockResult.total);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25").flush(mockResult);
    });
});
