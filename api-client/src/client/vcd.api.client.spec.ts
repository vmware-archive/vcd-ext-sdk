import { TestBed, async } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { LoggingInterceptor } from "./logging.interceptor";
import { RequestHeadersInterceptor } from "./request.headers.interceptor";
import { VcdApiClient } from "./vcd.api.client";
import { VcdHttpClient } from "./vcd.http.client";
import { AuthTokenHolderService, API_ROOT_URL, SESSION_SCOPE, SESSION_ORG_ID } from "../common";
import { SupportedVersionsType } from "@vcd/bindings/vcloud/api/rest/schema/versioning";
import { SessionType, TaskType, EntityReferenceType, QueryResultRecordsType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import { Query } from "../query";
import { ResponseNormalizationInterceptor } from "./response.normalization.interceptor";
import { HttpRequest } from "@angular/common/http";
import { ReflectiveInjector } from "@angular/core";
import { concatMap } from "rxjs/operators";

// verifies that the GET api/versions endpoint is called exactly once, and returns the provided response
function handleVersionNegotiation(versionResponse: SupportedVersionsType, httpMock: HttpTestingController): void {
    const req: TestRequest[] = httpMock.match("rootUrl/api/versions");
    expect(req.length).toBe(1);
    req[0].flush(versionResponse);
}

// verifies that the GET api/session endpoint is called exactly once, and returns a mock SessionType response
function handleSessionLoad(httpMock: HttpTestingController, provider: boolean = false): void {
    const req: TestRequest[] = httpMock.match("rootUrl/api/session");
    expect(req.length).toBe(1);
    let session = <SessionType> {};
    if (provider) {
        session.org = 'System';
    }

    req[0].flush(session);
}

const MOCK_TASK: TaskType = {
    id: "12345",
    type: "application/vnd.vmware.vcloud.task+json"
}

describe("API client pre-request validation", () => {
    let httpClient: VcdHttpClient;
    let httpMock: HttpTestingController;
    let apiClient: VcdApiClient;

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
        const injector = ReflectiveInjector.resolveAndCreate([VcdHttpClient,
            {provide: AuthTokenHolderService, useValue: { token: "authToken" }},
            {provide: API_ROOT_URL, useValue: "rootUrl"}])
        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    })

    it("negotiates with a server that supports most preferred/latest version", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.get("api/test").subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("negotiates with server that fulfills a less preferred but valid version", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.slice(1).map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.get("api/test").subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[1]);
        })

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("negotiates with server that does not have a version of the API that this client supports", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: [{ version: "15.0", mediaTypeMapping: [], deprecated: false }]
        };

        apiClient.get("api/test").subscribe(() => {
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

        apiClient.get("api/test").subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        })

        apiClient.get("api/test").subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        })

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        expect(httpMock.match("rootUrl/api/test").length).toBe(2);
    });

    it("verifies that explicit version request should bypass negotiation", () => {
        apiClient.setVersion("30.0");
        apiClient.get("api/test").subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS["30.0"]);
        });

        httpMock.expectNone("rootUrl/api/versions");
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("performs validation chain on createAsync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.createAsync("api/test", {}).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
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

        const entity = <EntityReferenceType>{ id: "12345", name: "test", type: "application/vnd.vmware.vcloud.test+json"};
        apiClient.createSync<EntityReferenceType>("api/test", entity).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
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

        apiClient.deleteAsync("api/test").subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
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

        apiClient.deleteSync("api/test").subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/test");
    });

    it("performs validation chain on updateAsync", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.updateAsync("api/test", {}).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
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

        const entity = <EntityReferenceType>{ id: "12345", name: "test", type: "application/vnd.vmware.vcloud.test+json"};
        apiClient.updateSync<EntityReferenceType>("api/test", entity).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
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

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []}
        apiClient.query(Query.Builder.ofType("test")).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.total).toBe(mockResult.total);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        httpMock.expectOne("rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25").flush(mockResult);
    });
});

describe("Provider in tenant scope actAs scoping", () => {
    let httpClient: VcdHttpClient;
    let httpMock: HttpTestingController;
    let apiClient: VcdApiClient;

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
        const injector = ReflectiveInjector.resolveAndCreate([VcdHttpClient,
            {provide: AuthTokenHolderService, useValue: { token: "authToken" }},
            {provide: API_ROOT_URL, useValue: "rootUrl"},
            {provide: SESSION_SCOPE, useValue: "tenant"},
            {provide: SESSION_ORG_ID, useValue: "a1b2c3d4e5f6"}])
        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it("is enabled by default", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []}
        apiClient.query(Query.Builder.ofType("test")).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url == "rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25"
              && request.headers.get('X-VMWARE-VCLOUD-TENANT-CONTEXT') == 'a1b2c3d4e5f6'
        }).flush(mockResult);
    });

    it("can be overridden", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []}
        apiClient.session.pipe(
            concatMap(() => {
                apiClient.actAs();
                return apiClient.query(Query.Builder.ofType("test"))
            })
        ).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);

        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url == "rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25"
              && !request.headers.has('X-VMWARE-VCLOUD-TENANT-CONTEXT')
        }).flush(mockResult);
    });
});

describe("Provider in provider scope actAs scoping", () => {
    let httpClient: VcdHttpClient;
    let httpMock: HttpTestingController;
    let apiClient: VcdApiClient;

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
        const injector = ReflectiveInjector.resolveAndCreate([VcdHttpClient,
            {provide: AuthTokenHolderService, useValue: { token: "authToken" }},
            {provide: API_ROOT_URL, useValue: "rootUrl"},
            {provide: SESSION_SCOPE, useValue: "provider"},
            {provide: SESSION_ORG_ID, useValue: "a1b2c3d4e5f6"}])
        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it("is disabled by default", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []}
        apiClient.query(Query.Builder.ofType("test")).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url == "rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25"
              && !request.headers.has('X-VMWARE-VCLOUD-TENANT-CONTEXT')
        }).flush(mockResult);
    });

    it("can be overridden", () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []}
        apiClient.session.pipe(
            concatMap(() => {
                apiClient.actAs({id: "f6e5d4c3b2a1" });
                return apiClient.query(Query.Builder.ofType("test"))
            })
        ).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url == "rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25"
              && request.headers.get('X-VMWARE-VCLOUD-TENANT-CONTEXT') == "f6e5d4c3b2a1"
        }).flush(mockResult);
    });
});