/*
 * Copyright 2021 VMware, Inc. All rights reserved. VMware Confidential
 */
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { parseHeaderHateoasLinks } from '.';
import { HTTP_HEADERS } from './constants';
import { RequestHeadersInterceptor } from './request.headers.interceptor';

interface Test {
    requestHeadersInterceptor: RequestHeadersInterceptor;
    httpClient: HttpClient;
    httpMock: HttpTestingController;
}

describe('RequestHeadersInterceptor', () => {
    beforeEach(function(this: Test) {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: RequestHeadersInterceptor,
                    multi: true,
                },
            ],
        });
        this.httpClient = TestBed.get(HttpClient);
        this.httpMock = TestBed.get(HttpTestingController);
        this.requestHeadersInterceptor = TestBed.get(HTTP_INTERCEPTORS).find(int => int instanceof RequestHeadersInterceptor);
    });
    afterEach(function(this: Test) {
        this.httpMock.verify();
    });

    describe('request headers', function(this: Test) {
        describe('auth related', () => {
            it('uses Authentication when authentication is bigger than 32 characters', function(this: Test) {
                this.requestHeadersInterceptor.authentication = 'Bearer abcdefghijklmnopqrstuvwxyz_0123456789';
                this.httpClient.get('endPoint').pipe(take(1)).subscribe();
                const reqHeaders: HttpHeaders = this.httpMock.expectOne('endPoint').request.headers;
                expect(reqHeaders.get(HTTP_HEADERS.Authorization)).toBe('Bearer abcdefghijklmnopqrstuvwxyz_0123456789');
                expect(reqHeaders.get(HTTP_HEADERS.x_vcloud_authorization)).toBe(null);
            });
            it('uses `x-vcloud-authorization` when authentication is less than 32 characters', function(this: Test) {
                this.requestHeadersInterceptor.authentication = '0123456789';
                this.httpClient.get('endPoint').pipe(take(1)).subscribe();
                const reqHeaders: HttpHeaders = this.httpMock.expectOne('endPoint').request.headers;
                expect(reqHeaders.get(HTTP_HEADERS.Authorization)).toBe(null);
                expect(reqHeaders.get(HTTP_HEADERS.x_vcloud_authorization)).toBe('0123456789');
            });
            it('does not overwrite `Authorization` header if it was already set', function(this: Test) {
                this.requestHeadersInterceptor.authentication = 'Bearer abcdefghijklmnopqrstuvwxyz_0123456789';
                const headers = {[HTTP_HEADERS.Authorization]: 'Basic credentials'};
                this.httpClient.get('endPoint', {headers}).pipe(take(1)).subscribe();
                const reqHeaders: HttpHeaders = this.httpMock.expectOne('endPoint').request.headers;
                expect(reqHeaders.get(HTTP_HEADERS.Authorization)).toBe('Basic credentials');
                expect(reqHeaders.get(HTTP_HEADERS.x_vcloud_authorization)).toBe(null);
            });
            it('does not set auth headers if authentication is not set', function(this: Test) {
                this.httpClient.get('endPoint').pipe(take(1)).subscribe();
                const reqHeaders: HttpHeaders = this.httpMock.expectOne('endPoint').request.headers;
                expect(reqHeaders.get(HTTP_HEADERS.Authorization)).toBe(null);
                expect(reqHeaders.get(HTTP_HEADERS.x_vcloud_authorization)).toBe(null);
            });
            it('does not set auth headers if authentication is set to null', function(this: Test) {
                this.requestHeadersInterceptor.authentication = null;
                this.httpClient.get('endPoint').pipe(take(1)).subscribe();
                const reqHeaders: HttpHeaders = this.httpMock.expectOne('endPoint').request.headers;
                expect(reqHeaders.get(HTTP_HEADERS.Authorization)).toBe(null);
                expect(reqHeaders.get(HTTP_HEADERS.x_vcloud_authorization)).toBe(null);
            });
            it('does not set auth headers if authentication is set to empty string', function(this: Test) {
                this.requestHeadersInterceptor.authentication = '';
                this.httpClient.get('endPoint').pipe(take(1)).subscribe();
                const reqHeaders: HttpHeaders = this.httpMock.expectOne('endPoint').request.headers;
                expect(reqHeaders.get(HTTP_HEADERS.Authorization)).toBe(null);
                expect(reqHeaders.get(HTTP_HEADERS.x_vcloud_authorization)).toBe(null);
            });
        });
    });

    describe('handling response', () => {

        // Angular is dealing with case sensitive links despite the specification https://github.com/angular/angular/issues/6142
        describe('related to `link` response headers', () => {
            it('adds `link` body property built from the `link` response header', function(this: Test) {
                const body = { someValue: 'test'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                    [HTTP_HEADERS.link]: '<url1>;rel="down";type="application/json";model="model1";title="id1",<url2>',
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith(body);
            });
            it('adds `link` body property built from the `link` response header even for arrays', function(this: Test) {
                const body = [1, 2, 3];
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                    [HTTP_HEADERS.link]: '<url1>;rel="down";type="application/json";model="model1";title="id1",<url2>',
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                const response = [...body];
                // Yeh, link property is attached even for arrays
                (response as any).link = parseHeaderHateoasLinks(headers[HTTP_HEADERS.link]);
                expect(subscriptionSpy).toHaveBeenCalledWith(response);
            });
            it('overwrites the original `link` body property if such exists', function(this: Test) {
                const body = { someValue: 'test', link: 'some link property'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = new HttpHeaders({
                    [HTTP_HEADERS.link]: '<url1>;rel="down";type="application/json";model="model1";title="id1",<url2>',
                });

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith({
                    ...body,
                    link: parseHeaderHateoasLinks(headers.get(HTTP_HEADERS.link)),
                });
            });
            it('does not modify the original `link` body property if there are no `link` response headers', function(this: Test) {
                const body = { someValue: 'test', link: 'some link property'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith(body);
            });
        });
        describe('related to `Link` response headers', () => {
            it('adds `link` body property built from the `Link` response header', function(this: Test) {
                const body = { someValue: 'test'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                    [HTTP_HEADERS.Link]: '<url1>;rel="down";type="application/json";model="model1";title="id1",<url2>',
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith({
                    ...body,
                    link: parseHeaderHateoasLinks(headers[HTTP_HEADERS.Link])
                });
            });
            it('adds `link` body property built from the `Link` response header even for arrays', function(this: Test) {
                const body = [1, 2, 3];
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                    [HTTP_HEADERS.Link]: '<url1>;rel="down";type="application/json";model="model1";title="id1",<url2>',
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                const response = [...body];
                // Yeh, link property is attached even for arrays
                (response as any).link = parseHeaderHateoasLinks(headers[HTTP_HEADERS.Link]);
                expect(subscriptionSpy).toHaveBeenCalledWith(response);
            });
            it('overwrites the original `link` body property if such exists', function(this: Test) {
                const body = { someValue: 'test', link: 'some link property'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = new HttpHeaders({
                    Link: '<url1>;rel="down";type="application/json";model="model1";title="id1",<url2>',
                });

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith({
                    ...body,
                    link: parseHeaderHateoasLinks(headers.get(HTTP_HEADERS.Link)),
                });
            });
            it('does not modify the original `link` body property if there are no `Link` response headers', function(this: Test) {
                const body = { someValue: 'test', link: 'some link property'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith(body);
            });
        });
        describe('related to `etag` response headers', () => {

            it('adds `etag` body property built from the `etag` response header without case sensitivity', function(this: Test) {
                const body = { someValue: 'test'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');

                const etagValue = 'feQNQBmFx1QgjJhLnvMoTA5Y5EWXQQQMshYuEEsyfig=--gzip';

                const headers = {
                    ['EtAg']: etagValue,
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith({
                    ...body,
                    etag: etagValue
                });
            });

            it('overwrites the original `etag` body property if such exists', function(this: Test) {
                const body = { someValue: 'test', etag: 'some etag property'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                    [HTTP_HEADERS.etag]: 'feQNQBmFx1QgjJhLnvMoTA5Y5EWXQQQMshYuEEsyfig=--gzip',
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith({
                    ...body,
                    etag: headers[HTTP_HEADERS.etag],
                });
            });
            it('does not modify the original `etag` body property if there are no `etag` response headers', function(this: Test) {
                const body = { someValue: 'test', etag: 'feQNQBmFx1QgjJhLnvMoTA5Y5EWXQQQMshYuEEsyfig=--gzipss'};
                const subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                const headers = {
                };

                this.httpClient.get('endPoint').pipe(take(1)).subscribe(subscriptionSpy);
                this.httpMock.expectOne('endPoint').flush(body, {headers});

                expect(subscriptionSpy).toHaveBeenCalledWith({
                    ...body,
                });
            });
        });
    });


});
