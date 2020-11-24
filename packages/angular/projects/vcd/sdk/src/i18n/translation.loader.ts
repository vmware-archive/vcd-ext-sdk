import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { EXTENSION_ASSET_URL } from '../common/container-hooks';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TranslationLoader {
    private static PREFIX = '/i18n/';
    private static SUFFIX = '.json';

    constructor(private http: HttpClient, @Inject(EXTENSION_ASSET_URL) private assetUrl: string) { }

    public getTranslation(language: string): Observable<any> {
        return this.http.get(`${this.assetUrl}${TranslationLoader.PREFIX}${language}${TranslationLoader.SUFFIX}`);
    }

    public getCombinedTranslation(): Observable<any> {
        return this.http.get(`${this.assetUrl}/../i18n${TranslationLoader.SUFFIX}`);
    }
}
