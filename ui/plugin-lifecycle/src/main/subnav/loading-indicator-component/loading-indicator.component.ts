/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, Input} from "@angular/core";
import { createStringEnum } from "../../helpers/object-helpers";

export const SIZES = createStringEnum(["sm", "md", "lg"]);
export type SpinnerSize = keyof typeof SIZES;

/**
 * Loading indicator for blocking modal dialogs while loading.
 */
@Component({
   selector: "vcd-loading-indicator",
   templateUrl: "loading-indicator.component.html",
   styleUrls: [
       "loading-indicator.component.scss"
    ]
})
export class LoadingIndicatorComponent {
    /**
     * Default spinner size set to "md" - medium used within the modal dialogs
     */
    private readonly defaultSpinnerSize: SpinnerSize = SIZES.md;
    /**
     * Spinner size.
     *
     * Spinners can be displayed in three sizes:
     *
     *  - sm(Small): This is the required sizing for inline spinners (see above). It measures 18x18 pixels.
     *  - md(Medium): Medium spinners measure 36x36 pixels. Default.
     *  - lg(Large): This is the default size for page spinners (see above).
     *
     */
    private _size: SpinnerSize = this.defaultSpinnerSize;
    /**
     * Show/hide the loading indicator.
     */
    @Input()
    public isLoading: boolean;

    /**
     * Show/hide the spinner if only an overlay is required.
     */
    @Input()
    public showSpinner: boolean = true;

    /**
     * Text to show next to the spinner.
     */
    @Input()
    public loadingTextKey: string = null;

    /**
     * Spinner size setter.
     * Sets default size if provided value is not from specified sized.
     */
    @Input()
    set size(size: SpinnerSize) {
        if (!size || Object.keys(SIZES).indexOf(size) === -1) {
            this._size = this.defaultSpinnerSize;
        } else {
            this._size = size;
        }
    }

    /**
     * Spinner position
     */
    @Input()
    public fixed: boolean = false;

    get size(): SpinnerSize {
        return this._size;
    }
}
