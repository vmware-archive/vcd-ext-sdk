import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';

class MockTranslateService extends TranslateService {
    constructor() {
        super(null);
    }

    public get(key: string, ...args: any[]): Observable<string | any> {
        return of(`key=${key},args=${JSON.stringify(args)}`);
    }
}

@Component({
    template: `
        <span>{{ "no-args" | translate }}</span>
        <span>{{ "with-1-arg" | translate : "arg1" }}</span>
        <span>{{ "with-2-args" | translate : "arg1" : "arg2" }}</span>
        <span>{{ "with-arg-array" | translate : ["arg1", "arg2"] }}</span>
    `
})
class TestComponent {
}

describe('TranslateService', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                TranslatePipe,
            ],
            providers: [
                { provide: TranslateService, useClass: MockTranslateService },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture = null;
    });

    it('translates', () => {
        const spans = fixture.debugElement.queryAll(By.css('span'));
        expect(spans.map((span) => span.nativeElement.textContent)).toEqual([
            'key=no-args,args=[]',
            'key=with-1-arg,args=["arg1"]',
            'key=with-2-args,args=["arg1","arg2"]',
            'key=with-arg-array,args=[["arg1","arg2"]]',
        ]);
    })
});