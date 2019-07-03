import {
    Component,
    Inject
} from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material';
import {
    Observable
} from 'rxjs';

import { ComponentBase } from './component-base';

export interface Data {
    title: string;
    message: string;
    /** send true to close dialog after action. error is ignored. */
    action?: () => Observable<boolean>;
    alert?: boolean;
    cancellable?: boolean;
}

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends ComponentBase<undefined> {
    constructor(
        public ref: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Data
    ) {
        super(undefined);
        if (undefined === this.data.action) {
            this.data.action = () => new Observable(obs => {
                obs.next(true); obs.complete();
            });
        }
    }

    uiOnCancel() {
        this.ref.close();
    }

    uiOnConfirm() {
        this.progressing(true);
        this.data.action().subscribe(v => {
            if (v) { this.ref.close(true); }
        }, ignored => {
            this.progressing(false);
        }, () => {
            this.progressing(false);
        });
    }
}
