import {
    Component,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
    MatSnackBar,
} from '@angular/material';

import { ComponentBase } from './reusable/component-base';
import {
    AppService,
    BackendService
} from './core';
import { State } from './app.store';
import { UserAction } from './root.store';
import { dbg } from './fbs/dbg';
const D = dbg(false);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends ComponentBase<State> implements
OnInit {
    initialized = false;
    waitingMsg = 'Loading...';

    private init() {
        this.app.init((msg) => {
            this.snackbar.open(msg);
        });
    }

    constructor(
        // public electronService: ElectronService,
        private readonly be: BackendService,
        private readonly app: AppService,
        private readonly snackbar: MatSnackBar,
        private readonly translate: TranslateService,
        private readonly router: Router,
        store: Store<State>,
    ) {
        super(store);
        translate.setDefaultLang('kr');

        try {
            this.init();
            this.initialized = true;
        } catch (e) {
            this.waitingMsg = 'App. initialization fails.\n' + e.toString();
        }
    }

    ngOnInit() {
        D.p('App compoonent...;. ngOnInit');
        // We have cookie. That is, session is NOT expired yet.
        this.be.userMe().subscribe(v => {
            // console.log('AppComponent session check ok');
            this.dispstore(new UserAction({id : v.id}));
        },
        e => {
            // Unexpected. Just move to login
            D.p('AppComponent session check fail: route to /login');
            this.dispstore(new UserAction(UserAction.unauthorizedUser()));
            this.router.navigate(['/login']);
        });
    }
}
