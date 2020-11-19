import { TranslationLoader } from "./translation.loader";
import { Observable, Observer, of } from "rxjs";
import { share, take } from "rxjs/operators";
import { Inject, LOCALE_ID, Injectable } from "@angular/core";

@Injectable()
export class TranslateService {
    private translation$: Observable<any>;
    private pending: boolean = false;
    public translations: any = {};

    private _combinedTranslations: boolean = true;
    public get combinedTranslations(): boolean {
        return this._combinedTranslations;
    }
    public set combinedTranslations(_combinedTranslations: boolean) {
        this._combinedTranslations = _combinedTranslations;
    }

    private _selectedLanguage: string;

    private _supportedLanguages: string[] = [];
    public get supportedLanguages(): string[] {
        return this._supportedLanguages;
    }
    public set supportedLanguages(_supportedLanguages: string[]) {
        this._supportedLanguages = _supportedLanguages;
    }

    private _defaultLanguage: string = '';
    public get defaultLanguage(): string {
        return this._defaultLanguage;
    }
    public set defaultLanguage(_defaultLanguage: string) {
        this._defaultLanguage = _defaultLanguage;
    }

    constructor(private loader: TranslationLoader) {}

    public prepareTranslations(supportedLanguages: string[], defaultLanguage: string): void {
        this._supportedLanguages = supportedLanguages;
        this._defaultLanguage = defaultLanguage;

        this._selectedLanguage = this.getBestMatchSupportedLanguage(navigator.language);
        this.getTranslation(this._selectedLanguage);
    }

    private getBestMatchSupportedLanguage(requestedLanguage: string): string {
        if (this._supportedLanguages.indexOf(requestedLanguage) > -1) {
            return requestedLanguage;
        }

        let altLanguage: string = requestedLanguage.split('-')[0];
        if (altLanguage == requestedLanguage) {
            return this._defaultLanguage;
        }

        return (this._supportedLanguages.indexOf(altLanguage) > -1) ? altLanguage : this._defaultLanguage;
    }

    public getTranslation(language: string): Observable<any> {
        this.pending = true;
        this.translation$ = this._combinedTranslations ? this.loader.getCombinedTranslation() : this.loader.getTranslation(language).pipe(share());

        this.translation$.pipe(take(1)).subscribe(result => {
            this.translations = result;
            this.pending = false;
        }, error => {
            this.pending = false;
        });

        return this.translation$;
    }

    private getParsedResult(key: string, ...args: any[]): string {
        let result = (this._combinedTranslations && this.translations[this._selectedLanguage]) ? this.translations[this._selectedLanguage][key] : this.translations[key];
        if (Array.isArray(result)) {
            result = result.join('');
        }

        return !result ? `#${key}#` : result.replace(/{([0-9]+)}/g, (_, ...n) => {
            const idx = parseInt(n[0]);
            if (args && typeof args[idx] !== 'undefined') {
                return args[idx];
            }

            return '';
        });
    }

    public get(key: string, ...args: any[]): Observable<string | any> {
        if (!this.pending) {
            return of(this.getParsedResult(key, ...args));
        }

        return Observable.create((observer: Observer<string>) => {
            let onComplete = (result: string) => {
                observer.next(result);
                observer.complete();
            };
            let onError = (error: any) => {
                observer.error(error);
            };
            this.translation$.subscribe(result => {
                result = this.getParsedResult(key, ...args);
                onComplete(result);
            }, onError);
        });
    }
}
