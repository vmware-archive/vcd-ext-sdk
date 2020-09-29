import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Inject, Injectable } from "@angular/core";
import { EXTENSION_ASSET_URL } from "../common/container-hooks";
import { catchError } from "rxjs/operators";

@Injectable()
export class TranslationLoader {
    private static PREFIX: string = '/i18n/';
    private static SUFFIX: string = '.json';

    constructor(private http: HttpClient, @Inject(EXTENSION_ASSET_URL) private assetUrl: string) { }

    public getTranslation(language: string): Observable<Object> {
        return this.http.get(`${this.assetUrl}${TranslationLoader.PREFIX}${language}${TranslationLoader.SUFFIX}`);
    }

    public getCombinedTranslation(): Observable<Object> {
        return this.http.get(`${this.assetUrl}/../i18n${TranslationLoader.SUFFIX}`);
    }
} 