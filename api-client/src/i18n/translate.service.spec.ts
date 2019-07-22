import {TranslateService} from './translate.service';
import {TranslationLoader} from './translation.loader';
import {Observable} from 'rxjs';

class MockTranslationLoader extends TranslationLoader {
    constructor() {
        super(null, '');
    }

    getCombinedTranslation(): Observable<Object> {
        const translation = {
            'en': {
                "duration": "{0} hours {1} minutes"
            }
        };
        return Observable.of(translation);
    }
}

describe('TranslateService', function () {
    it('should accept 2 arguments', function () {
        const loader = new MockTranslationLoader();
        const translate = new TranslateService(loader);

        translate.prepareTranslations(['en'], 'en');

        translate.get('duration', 11, 0).subscribe((result) => {
            expect(result).toEqual('11 hours 0 minutes');
        });
    });
});
