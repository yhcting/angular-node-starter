import {
    Component,
    OnInit,
} from '@angular/core';
import {
    Router
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
    Subject,
    Observable
} from 'rxjs';
import {
    MatSnackBar,
} from '@angular/material';
import * as _ from 'lodash';

import { ComponentBase } from '../reusable/component-base';
import {
    AppService,
    BackendService
} from '../core';

import { State } from './main.store';
import {
    InProgressAction,
    UserAction
} from '../root.store';
import { LOGIN_FORM_ID } from '../storage-key';

@Component({
    // All bindings are made up of Observable. Therefore OnPush strategy is valid
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent extends ComponentBase<State> implements
OnInit {
    inProgress$: Observable<boolean>; // overriding
    form = {id: '', pw: ''};

    constructor(
        private readonly be: BackendService,
        private readonly app: AppService,
        private readonly router: Router,
        private readonly translate: TranslateService,
        store: Store<State>
    ) { super(store); }

    ngOnInit() {
        this.inProgress$ = this.selstore(InProgressAction.selector());
        this.getstore(UserAction.selector()).subscribe(v => {
            this.form.id = v ? v.id : '';
        });
        const uid = localStorage.getItem(LOGIN_FORM_ID);
        this.form.id = uid ? uid : '';
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    uiOnLoginSubmit() {
        const uid = this.form.id;
        this.be.userLogin({
            id: uid,
            pw: this.form.pw
        }).subscribe(ignored => {
            this.app.login(uid);
            localStorage.setItem(LOGIN_FORM_ID, uid);
            this.router.navigate(['/home']);
        }, e => this.app.notifyBeError(e));
    }
}
