import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TagListService {
    private _tags: string[] = [];
    private _tagsSubject = new BehaviorSubject<string[]>(this._tags);

    constructor() { }

    public getTags(): Observable<string[]> {
        return this._tagsSubject.asObservable();
    }

    public setTags(tags: string[]): void {
        this._tags = tags;
        this._tagsSubject.next(this._tags);
    }

    public addTag(tag: string): void {
        this._tags.push(tag);
        this._tagsSubject.next(this._tags);
    }

    public removeTag(tag: string) {
        this._tags.splice(this._tags.indexOf(tag), 1);
        this._tagsSubject.next(this._tags);
    }
}