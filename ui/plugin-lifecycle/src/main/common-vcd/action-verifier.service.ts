/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */

import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ModalWindow, ModalData } from "../interfaces/Modal";

interface SubjectModalData {
    accept: boolean;
}

@Injectable()
export class ActionVerifierService {
    private _modal = new ModalWindow();
    private _modalData = new Subject<SubjectModalData>();
    private _openModal = new Subject<ModalWindow>();

    constructor() {}

    /**
     * Get modal object
     */
    get modal() {
        return this._modal;
    }

    /**
     * Observe modal state
     */
    public watchModalState() {
        return this._openModal.asObservable();
    }

    /**
     * Open modal with spcified options.
     */
    public openModal(options: ModalData): Observable<SubjectModalData> {
        this._modal.opened = true;
        this._modal.title = options.title || null;
        this._modal.body = options.body || null;
        this._modal.decline = options.decline || null;
        this._modal.accept = options.accept || null;
        this._modal.waitToClose = options.waitToClose || false;

        this._openModal.next(this._modal);

        return this.watchModalData();
    }

    /**
     * Close modal window, reset all values and emit the modal object.
     */
    public closeModal(): void {
        this._modal.opened = false;
        this._modal.title = null;
        this._modal.body = null;
        this._modal.decline =  null;
        this._modal.accept = null;
        this._modal.waitToClose = false;

        this._openModal.next(this._modal);
    }

    /**
     * Observe the modal data.
     */
    public watchModalData(): Observable<SubjectModalData> {
        return this._modalData.asObservable();
    }

    /**
     * The method will notify all listers for this action.
     * @param accept value to be emitted to all listeners.
     */
    public emitAndClose(accept: boolean): void {
        if (!this._modal.waitToClose) {
            this._modal.opened = false;
        }
        this._modalData.next({ accept });
    }
}
