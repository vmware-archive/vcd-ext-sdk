import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { RequestHeadersInterceptor } from './request.headers.interceptor';
import {LinkRelType, Navigable, VcdApiClient} from './vcd.api.client';
import { VcdHttpClient } from './vcd.http.client';
import { AuthTokenHolderService, API_ROOT_URL, SESSION_SCOPE, SESSION_ORG_ID } from '../container-hooks';
import { SupportedVersionsType } from '@vcd/bindings/vcloud/api/rest/schema/versioning';
import { SessionType, TaskType, EntityReferenceType, QueryResultRecordsType } from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { Query } from '../query';
import { ResponseNormalizationInterceptor } from './response.normalization.interceptor';
import {HttpHeaders, HttpRequest} from '@angular/common/http';
import { ReflectiveInjector } from '@angular/core';
import { concatMap, take } from 'rxjs/operators';
import { Session } from '../openapi';
import { HTTP_HEADERS } from './constants';
import { ACCESSIBLE_LOCATIONS, CLOUDAPI_SESSION } from './vcd.api.client.spec.data';
import { Subscription } from 'rxjs';

// verifies that the GET api/versions endpoint is called exactly once, and returns the provided response
function handleVersionNegotiation(versionResponse: SupportedVersionsType, httpMock: HttpTestingController): void {
    const req: TestRequest[] = httpMock.match('rootUrl/api/versions');
    expect(req.length).toBe(1);
    req[0].flush(versionResponse);
}

// verifies that the GET api/session endpoint is called exactly once, and returns a mock SessionType response
function handleSessionLoad(httpMock: HttpTestingController, provider: boolean = false): void {
    const req: TestRequest[] = httpMock.match('rootUrl/api/session');
    expect(req.length).toBe(1);
    const session = {} as SessionType;
    if (provider) {
        session.org = 'System';
    }

    req[0].flush(session);
}

// verifies that the GET api/session endpoint is called exactly once, and returns a mock SessionType response
function handleCloudApiSessionLoad(httpMock: HttpTestingController, provider: boolean = false): void {
    const req: TestRequest[] = httpMock.match('rootUrl/cloudapi/1.0.0/sessions/current');
    expect(req.length).toBe(1);
    const session = {} as Session;
    if (provider) {
        session.org = {name: 'System', id: 'system_session_id'};
    }

    req[0].flush(session);
}

const MOCK_TASK: TaskType = {
    id: '12345',
    type: 'application/vnd.vmware.vcloud.task+json'
};

describe('API client pre-request validation', () => {
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
            {provide: AuthTokenHolderService, useValue: { token: 'authToken' }},
            {provide: API_ROOT_URL, useValue: 'rootUrl'}]);
        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    describe('authentication headers', () => {

        it('uses `x-vcloud-authorization` header if jwt is not provided', () => {
            apiClient.setVersion('30.0');
            apiClient.get('api/test').pipe(take(1)).subscribe(() => {
            });
            handleSessionLoad(httpMock);
            // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
            handleCloudApiSessionLoad(httpMock);
            const req: TestRequest = httpMock.expectOne('rootUrl/api/test');
            expect(req.request.headers.get('x-vcloud-authorization')).toBe('authToken');
        });

        it('uses `Authorization` header with value `Bearer JWT` when jwt is provided', () => {
            const injector = ReflectiveInjector.resolveAndCreate([VcdHttpClient,
                {provide: AuthTokenHolderService, useValue: { token: 'authToken', jwt: 'JWT_TOKEN_which_is_longer_than_32' }},
                {provide: API_ROOT_URL, useValue: 'rootUrl'}]);
            apiClient = new VcdApiClient(httpClient, injector);

            apiClient.setVersion('30.0');
            apiClient.get('api/test').pipe(take(1)).subscribe(() => {
            });
            handleSessionLoad(httpMock);
            // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
            handleCloudApiSessionLoad(httpMock);
            const req: TestRequest = httpMock.expectOne('rootUrl/api/test');
            expect(req.request.headers.get('x-vcloud-authorization')).toEqual(null);
            expect(req.request.headers.get('Authorization')).toBe(`Bearer JWT_TOKEN_which_is_longer_than_32`);
        });
    });

    it('negotiates with a server that supports most preferred/latest version', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.get('api/test').subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test');
    });

    it('negotiates with server that fulfills a less preferred but valid version', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.slice(1).map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.get('api/test').subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[1]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test');
    });

    it('negotiates with server that does not have a version of the API that this client supports', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: [{ version: '15.0', mediaTypeMapping: [], deprecated: false }]
        };

        apiClient.get('api/test').subscribe(() => {
            fail('expected error');
        }, (error) => {
            expect(error);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
    });

    it('verifies that negotation only happens once for multiple API calls', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.get('api/test').subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        apiClient.get('api/test').subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        expect(httpMock.match('rootUrl/api/test').length).toBe(2);
    });

    it('verifies that explicit version request should bypass negotiation', () => {
        apiClient.setVersion('30.0');
        apiClient.get('api/test').subscribe(() => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS['30.0']);
        });

        httpMock.expectNone('rootUrl/api/versions');
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test');
    });

    it('performs two session calls to the backend one for the deprecated `api` endpoint and one to the `cloudapi`', () => {
        const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
        apiClient.setVersion('30.0');
        apiClient.get('api/test').subscribe(subscriptionSpy);

        // There is no api call since there are two pending observables
        httpMock.expectNone('rootUrl/api/test');

        // Resolve the observables
        httpMock.expectOne('rootUrl/api/session').flush({});
        httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush({});

        // Now there is an api request
        httpMock.expectOne('rootUrl/api/test').flush({});
        expect(subscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it('performs validation chain on createAsync', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.createAsync('api/test', {}).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(MOCK_TASK);
    });

    it('performs validation chain on createSync', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const entity = { id: '12345', name: 'test', type: 'application/vnd.vmware.vcloud.test+json'} as EntityReferenceType;
        apiClient.createSync<EntityReferenceType>('api/test', entity).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(entity.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(entity);
    });

    it('performs validation chain on deleteAsync', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.deleteAsync('api/test').subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(MOCK_TASK);
    });

    it('performs validation chain on deleteSync', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.deleteSync('api/test').subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test');
    });

    it('performs validation chain on updateAsync without options param', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.updateAsync('api/test', {}).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(MOCK_TASK);
    });

    it('performs validation chain on updateAsync with options param', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        apiClient.updateAsync('api/test', {}, {headers: new HttpHeaders({
                'If-Match': 'hcCcXsntrz91EhA/ggwn/KzJfsb96Jcn7f41DA5I3EM=--gzip'
            })}).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(MOCK_TASK.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(MOCK_TASK);
    });

    it('performs validation chain on updateSync without options param', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const entity = { id: '12345', name: 'test', type: 'application/vnd.vmware.vcloud.test+json'} as EntityReferenceType;
        apiClient.updateSync<EntityReferenceType>('api/test', entity).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(entity.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(entity);
    });

    it('performs validation chain on updateSync with options param', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const entity = { id: '12345', name: 'test', type: 'application/vnd.vmware.vcloud.test+json'} as EntityReferenceType;
        apiClient.updateSync<EntityReferenceType>('api/test', entity, {headers: new HttpHeaders({
                'If-Match': 'hcCcXsntrz91EhA/ggwn/KzJfsb96Jcn7f41DA5I3EM=--gzip'
            })}).subscribe(result => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.id).toBe(entity.id);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/test').flush(entity);
    });

    it('performs validation chain on query', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []};
        apiClient.query(Query.Builder.ofType('test')).subscribe((result: QueryResultRecordsType) => {
            expect(apiClient.version).toBe(VcdApiClient.CANDIDATE_VERSIONS[0]);
            expect(result.total).toBe(mockResult.total);
        });

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock);

        httpMock.expectOne('rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25').flush(mockResult);
    });
});

describe('Provider in tenant scope actAs scoping', () => {
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
            {provide: AuthTokenHolderService, useValue: { token: 'authToken' }},
            {provide: API_ROOT_URL, useValue: 'rootUrl'},
            {provide: SESSION_SCOPE, useValue: 'tenant'},
            {provide: SESSION_ORG_ID, useValue: 'a1b2c3d4e5f6'}]);
        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('is enabled by default', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []};
        apiClient.query(Query.Builder.ofType('test')).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock, true);

        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url === 'rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25'
              && request.headers.get('X-VMWARE-VCLOUD-TENANT-CONTEXT') === 'a1b2c3d4e5f6';
        }).flush(mockResult);
    });

    it('can be overridden', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []};
        apiClient.session.pipe(
            concatMap(() => {
                apiClient.actAs();
                return apiClient.query(Query.Builder.ofType('test'));
            })
        ).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock, true);

        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url === 'rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25'
              && !request.headers.has('X-VMWARE-VCLOUD-TENANT-CONTEXT');
        }).flush(mockResult);
    });
});

describe('Provider in provider scope actAs scoping', () => {
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
            {provide: AuthTokenHolderService, useValue: { token: 'authToken' }},
            {provide: API_ROOT_URL, useValue: 'rootUrl'},
            {provide: SESSION_SCOPE, useValue: 'provider'},
            {provide: SESSION_ORG_ID, useValue: 'a1b2c3d4e5f6'}]);
        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('is disabled by default', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []};
        apiClient.query(Query.Builder.ofType('test')).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock, true);

        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url === 'rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25'
              && !request.headers.has('X-VMWARE-VCLOUD-TENANT-CONTEXT');
        }).flush(mockResult);
    });

    it('can be overridden', () => {
        const supportedVersions: SupportedVersionsType = {
            versionInfo: VcdApiClient.CANDIDATE_VERSIONS.map(v => ({ version: v, mediaTypeMapping: [], deprecated: false }))
        };

        const mockResult: QueryResultRecordsType = {page: 1, total: 25, record: []};
        apiClient.session.pipe(
            concatMap(() => {
                apiClient.actAs({id: 'f6e5d4c3b2a1' });
                return apiClient.query(Query.Builder.ofType('test'));
            })
        ).subscribe();

        handleVersionNegotiation(supportedVersions, httpMock);
        handleSessionLoad(httpMock, true);
        // Introducing `cloudapi`, deprecating the old `api` endpoint requires two calls to the backend (until the old `api` is removed)
        handleCloudApiSessionLoad(httpMock, true);

        httpMock.expectOne((request: HttpRequest<any>) => {
            return request.url === 'rootUrl/api/query?type=test&format=idrecords&links=true&pageSize=25'
              && request.headers.get('X-VMWARE-VCLOUD-TENANT-CONTEXT') === 'f6e5d4c3b2a1';
        }).flush(mockResult);
    });
});

describe('API client utility code', () => {
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
            {provide: AuthTokenHolderService, useValue: {token: 'authToken'}},
            {provide: API_ROOT_URL, useValue: 'rootUrl'}]);

        apiClient = new VcdApiClient(httpClient, injector);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    describe('canPerformAction', () => {

        const type = 'DummyType';
        let item: Navigable;

        beforeEach(() => {
            item = {
                link: [{
                    rel: LinkRelType.remove,
                    type,
                    href: 'https://dummy-url.com'
                }]
            };
        });

        afterEach(() => {
            item = null;
        });

        it('can resolve action availability with links and type', () => {

            expect(apiClient.canPerformAction(item, LinkRelType.remove, type)).toBeTruthy();
        });

        it('can resolve action availability with links', () => {

            expect(apiClient.canPerformAction(item, LinkRelType.remove)).toBeTruthy();
        });

        it('can resolve action availability without links', () => {

            item.link = [];

            expect(apiClient.canPerformAction(item, LinkRelType.remove)).toBeFalsy();
        });
    });
});

describe('cloudapi', () => {
    let httpClient: VcdHttpClient;
    let httpMock: HttpTestingController;
    let apiClient: VcdApiClient;
    const subs: Subscription[] = [];
    const subscriptionSpy = jasmine.createSpy('subscriptionSpy');

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
            {provide: AuthTokenHolderService, useValue: { token: 'authToken', jwt: 'JWT_TOKEN_which_is_longer_than_32' }},
            {provide: API_ROOT_URL, useValue: 'rootUrl'},
            {provide: SESSION_ORG_ID, useValue: 'a1b2c3d4e5f6'}]);
        apiClient = new VcdApiClient(httpClient, injector);
        // Version doesn't matter in fact we set it in order the testing code to be simpler
        apiClient.setVersion('30.0');
    }));

    afterEach(() => {
        httpMock.verify();
        subscriptionSpy.calls.reset();
        subs.forEach(s => s.unsubscribe());
        subs.length = 0;
    });

    function performCloudApiLogin(onSuccess = (s?) => {}, onError = () => {}) {
        const headers = {
            ['x-vmware-vcloud-token-type']: ['Bearer'],
            ['x-vmware-vcloud-access-token']: 'abcdefghijklmnopqrstuvwxyz_0123456789',
            // Link headers become part of the body {@link RequestHeadersInterceptor#intercept}
            [HTTP_HEADERS.Link]: '<accessibleLocations>;rel="down";type="application/json";model="AccessibleLocations"',
        };

        apiClient.cloudApiLogin('user', 'Org1', 'pass').pipe(take(1)).subscribe(onSuccess, onError);
        httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions').flush({...CLOUDAPI_SESSION}, {headers});
    }

    function performAuthFailure(operation: string, onSuccess = () => {}, onError = () => {}) {
        if (operation === 'cloudApiLogin') {
            apiClient.cloudApiLogin('user', 'Org1', 'pass').pipe(take(1)).subscribe(onSuccess, onError);
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions').error(null);
        } else if (operation === 'setCloudApiAuthentication') {
            apiClient.setCloudApiAuthentication('any').pipe(take(1)).subscribe(onSuccess, onError);
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').error(null);
        } else {
            throw new Error('Unsuported operation');
        }
    }

    function sharedAuthenticationFailures(operation: string) {

        describe('on error', () => {

            it('throws an error', () => {
                const onSuccess = jasmine.createSpy('onSuccess');
                const onError = jasmine.createSpy('onError');
                performAuthFailure(operation, onSuccess, onError);
                expect(onSuccess).not.toHaveBeenCalled();
                expect(onError).toHaveBeenCalled();
            });

            describe('when there was a valid session before', () => {

                beforeEach(() => {
                    performCloudApiLogin();
                });

                it('emits null session', () => {
                    subs.push(apiClient.cloudApiSession.subscribe(subscriptionSpy));
                    expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.objectContaining(CLOUDAPI_SESSION));
                    performAuthFailure(operation);
                    expect(subscriptionSpy).toHaveBeenCalledWith(null);
                    expect(subscriptionSpy).toHaveBeenCalledTimes(2);
                });

                it('does not set Authentication header for any subsequent calls', () => {
                    performAuthFailure(operation);
                    subs.push(apiClient.get('endPoint').subscribe(subscriptionSpy));
                    const req: TestRequest = httpMock.expectOne('rootUrl/endPoint');
                    expect(req.request.headers.get(HTTP_HEADERS.Authorization)).toBe(null);
                    expect(subscriptionSpy).not.toHaveBeenCalled();
                });
            });

        });

    }

    describe('accessing the old `api` endpoint', () => {
        it('does not exist after `cloudApiLogin()` call', () => {
            performCloudApiLogin();
            subs.push(apiClient.get('endPoint').subscribe(subscriptionSpy));
            httpMock.expectNone((request: HttpRequest<any>) => request.url.includes('/api'));
            httpMock.expectOne('rootUrl/endPoint');
            expect(subscriptionSpy).not.toHaveBeenCalled();
        });
        it('exists if no explicit cloud api authentication is done', () => {
            subs.push(apiClient.get('endPoint').subscribe(subscriptionSpy));
            httpMock.expectNone('rootUrl/endPoint');
            httpMock.expectOne('rootUrl/api/session').flush({});
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush({});
            httpMock.expectOne('rootUrl/endPoint').flush({});
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });
        it('is not affected if cloudapi/1.0.0/sessions/current fails', () => {
            subs.push(apiClient.get('endPoint').subscribe(subscriptionSpy));
            httpMock.expectOne('rootUrl/api/session').flush({});
            // httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush({});
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').error(null);
            httpMock.expectOne('rootUrl/endPoint').flush({});
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });
        describe('after cloud api authentication', () => {
            beforeEach(() => performCloudApiLogin());
            it('throws an error when calling `login` to the old /api endpoint', () => {
                const errorSubscriptionSpy = jasmine.createSpy('errorSubscriptionSpy');
                subs.push(apiClient.login('user', 'Org1', 'pass').subscribe(subscriptionSpy, errorSubscriptionSpy));
                expect(subscriptionSpy).not.toHaveBeenCalled();
                expect(errorSubscriptionSpy).toHaveBeenCalled();
            });
            it('throws an error when calling `setAuthentication` to the old /api endpoint', () => {
                const errorSubscriptionSpy = jasmine.createSpy('errorSubscriptionSpy');
                subs.push(apiClient.setAuthentication('any').subscribe(subscriptionSpy, errorSubscriptionSpy));
                expect(subscriptionSpy).not.toHaveBeenCalled();
                expect(errorSubscriptionSpy).toHaveBeenCalled();
            });

        });
    });

    describe('cloudApiLogin', () => {

        it('performs a call to a provider endpoint when login as System', () => {
            subs.push(apiClient.cloudApiLogin('user', 'System', 'pass').subscribe(subscriptionSpy));
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/provider').flush({});
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('performs a call to a tenant endpoint when login as tenant', () => {
            subs.push(apiClient.cloudApiLogin('user', 'Org1', 'pass').subscribe(subscriptionSpy));
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions').flush({});
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('uses `Basic` authentication header', () => {
            subs.push(apiClient.cloudApiLogin('user', 'Org1', 'pass').subscribe(subscriptionSpy));
            const req: TestRequest = httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions');
            req.flush({});
            expect(req.request.headers.get(HTTP_HEADERS.Authorization)).toBe(`Basic ${btoa('user@Org1:pass')}`);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        describe('on success', () => {

            it('returns a session', () => {
                performCloudApiLogin(subscriptionSpy);
                expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.objectContaining(CLOUDAPI_SESSION));
            });

            describe('subsequent requests', () => {

                beforeEach(() => {
                    performCloudApiLogin();
                });

                it('reuse the authentication from the login response', () => {
                    subs.push(apiClient.get('endPoint').subscribe(subscriptionSpy));
                    const req: TestRequest = httpMock.expectOne('rootUrl/endPoint');
                    req.flush({});
                    expect(req.request.headers.get(HTTP_HEADERS.Authorization)).toBe('Bearer abcdefghijklmnopqrstuvwxyz_0123456789');
                    expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                });

                it('do not produce a call to the old `api` endpoint', () => {
                    subs.push(apiClient.get('endPoint').subscribe(subscriptionSpy));
                    httpMock.expectNone((request: HttpRequest<any>) => request.url.includes('/api'));
                    httpMock.expectOne('rootUrl/endPoint').flush({});
                    expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                });

            });
        });

        sharedAuthenticationFailures('cloudApiLogin');

    });

    describe('setCloudApiAuthentication', () => {

        it('does not sets the Authorization header if there is no subscription to the observable', () => {
            apiClient.setCloudApiAuthentication('Bearer abcdefghijklmnopqrstuvwxyz_0123456789');
            httpMock.expectNone('rootUrl/cloudapi/1.0.0/sessions/current');
            subs.push(apiClient.get('endPoint').subscribe());
            const req: TestRequest = httpMock.expectOne('rootUrl/endPoint');
            expect(req.request.headers.get(HTTP_HEADERS.Authorization)).not.toBe('Bearer abcdefghijklmnopqrstuvwxyz_0123456789');
        });

        it('sets the Authorization header for the current session request', () => {
            subs.push(apiClient.setCloudApiAuthentication('Bearer abcdefghijklmnopqrstuvwxyz_0123456789').subscribe());
            const req: TestRequest = httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current');
            expect(req.request.headers.get(HTTP_HEADERS.Authorization)).toBe('Bearer abcdefghijklmnopqrstuvwxyz_0123456789');
        });

        it('sets the Authorization header for the subsequent requests', () => {
            subs.push(apiClient.setCloudApiAuthentication('Bearer abcdefghijklmnopqrstuvwxyz_0123456789').subscribe());
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current');
            subs.push(apiClient.get('endPoint').subscribe());
            const req: TestRequest = httpMock.expectOne('rootUrl/endPoint');
            expect(req.request.headers.get(HTTP_HEADERS.Authorization)).toBe('Bearer abcdefghijklmnopqrstuvwxyz_0123456789');
        });

        it('returns a session', () => {
            subs.push(apiClient.setCloudApiAuthentication('any').subscribe(subscriptionSpy));
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush(CLOUDAPI_SESSION);
            expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.objectContaining(CLOUDAPI_SESSION));
        });

        sharedAuthenticationFailures('setCloudApiAuthentication');

    });

    describe('cloudApiSession', () => {

        it('is emitted after `cloudApiLogin()` call', () => {
            performCloudApiLogin();
            apiClient.cloudApiSession.subscribe(subscriptionSpy);
            expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.objectContaining(CLOUDAPI_SESSION));
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('is emitted after `setCloudApiAuthentication()` call', () => {
            subs.push(apiClient.setCloudApiAuthentication('any').subscribe());
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush(CLOUDAPI_SESSION);
            apiClient.cloudApiSession.subscribe(subscriptionSpy);
            expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.objectContaining(CLOUDAPI_SESSION));
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

    });

    describe('username', () => {

        it('is emitted after `cloudApiLogin()` call', () => {
            performCloudApiLogin();
            subs.push(apiClient.username.subscribe(subscriptionSpy));
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.user.name);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('is emitted after `setCloudApiAuthentication()` call', () => {
            subs.push(apiClient.setCloudApiAuthentication('any').subscribe());
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush(CLOUDAPI_SESSION);
            subs.push(apiClient.username.subscribe(subscriptionSpy));
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.user.name);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('is null after `cloudApiLogin()` failure', () => {
            performCloudApiLogin();
            subs.push(apiClient.username.subscribe(subscriptionSpy));
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.user.name);
            performAuthFailure('cloudApiLogin');
            expect(subscriptionSpy).toHaveBeenCalledWith(null);
            expect(subscriptionSpy).toHaveBeenCalledTimes(2);
        });

        it('can be subscribed to in advance', () => {
            // Intentionally subscribe in advance
            subs.push(apiClient.username.subscribe(subscriptionSpy));

            // Since we are subscribing prior to explicit cloudapi request there are 2 pending requests
            // originating from the constructor
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush({});
            httpMock.expectOne('rootUrl/api/session').flush({user: 'user_name'});
            expect(subscriptionSpy).toHaveBeenCalledWith('user_name');
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
            subscriptionSpy.calls.reset();

            // Provide the request from the constructor
            performCloudApiLogin();
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.user.name);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

    });

    describe('organization', () => {

        it('is emitted after `cloudApiLogin()` call', () => {
            performCloudApiLogin();
            subs.push(apiClient.organization.subscribe(subscriptionSpy));
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.org.name);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('is emitted after `setCloudApiAuthentication()` call', () => {
            subs.push(apiClient.setCloudApiAuthentication('any').subscribe());
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush(CLOUDAPI_SESSION);
            subs.push(apiClient.organization.subscribe(subscriptionSpy));
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.org.name);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

        it('is null after `cloudApiLogin()` failure', () => {
            performCloudApiLogin();
            subs.push(apiClient.organization.subscribe(subscriptionSpy));
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.org.name);
            performAuthFailure('cloudApiLogin');
            expect(subscriptionSpy).toHaveBeenCalledWith(null);
            expect(subscriptionSpy).toHaveBeenCalledTimes(2);
        });

        it('can be subscribed to in advance', () => {
            // Intentionally subscribe in advance
            subs.push(apiClient.organization.subscribe(subscriptionSpy));

            // Since we are subscribing prior to explicit cloudapi request there are 2 pending requests
            // originating from the constructor
            httpMock.expectOne('rootUrl/cloudapi/1.0.0/sessions/current').flush({});
            httpMock.expectOne('rootUrl/api/session').flush({org: 'org_name'});
            expect(subscriptionSpy).toHaveBeenCalledWith('org_name');
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
            subscriptionSpy.calls.reset();

            // Provide the request from the constructor
            performCloudApiLogin();
            expect(subscriptionSpy).toHaveBeenCalledWith(CLOUDAPI_SESSION.org.name);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

    });

    describe('cloudApiLocation', () => {

        it('is emitted after `cloudApiLogin()` call', () => {
            performCloudApiLogin();
            subs.push(apiClient.cloudApiLocation.subscribe(subscriptionSpy));
            // There is a request to the backend to get the accessibleLocations
            httpMock.expectOne('accessibleLocations').flush(ACCESSIBLE_LOCATIONS);
            expect(subscriptionSpy).toHaveBeenCalledWith(ACCESSIBLE_LOCATIONS.values[0]);
            expect(subscriptionSpy).toHaveBeenCalledTimes(1);
        });

    });

});

