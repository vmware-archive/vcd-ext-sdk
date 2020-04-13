import { Injectable, PipeTransform, Pipe, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from "./translate.service";

@Injectable()
@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {
    private value: string = '';
    private lastKey: string = '';
    private lastArgs: any[] = [];

    constructor(private translate: TranslateService, private changeDetector: ChangeDetectorRef) { }

    transform(key: string, ...args: any[]): any {
        if (!key || key.length == 0) {
            return key;
        }

        if (key == this.lastKey && args == this.lastArgs) {
            return this.value;
        }

        this.lastKey = key;
        this.lastArgs = args;
        this.updateValue(key, args);

        return this.value;
    }

    private updateValue(key: string, args: any[]): void {
        this.translate.get(key, ...args).subscribe(result => {
            this.value = result;
            this.changeDetector.markForCheck();
        });
    }
}
