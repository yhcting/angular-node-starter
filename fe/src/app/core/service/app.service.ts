//////////////////////////////////////////////////////////////////////////////
//
// Application common service - simple and misc. app-services.
//
//////////////////////////////////////////////////////////////////////////////
import {
    Injectable
} from '@angular/core';
import {
    ActivatedRoute,
    Params,
    ParamMap,
    Router
} from '@angular/router';
import {
    Location
} from '@angular/common';
import {
    Observable,
} from 'rxjs';
import {
    take,
    filter
} from 'rxjs/operators';
import {
    Action,
    Store
} from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
    MatSnackBar,
} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';

import { State } from '../../app.store';
import {
    UserAction,
    InProgressAction,
} from '../../root.store';
import { COOKIES } from '../../fbs/cookie';
import * as DtoCmmn from '../../fbs/dto/cmmn';
import { BackendService } from './backend.service';


@Injectable({
    providedIn: 'root',
})
export class AppService {
    private uid: string | null; // current uid. This should matches UserAction.id

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    constructor(
        private readonly be: BackendService,
        private readonly snackbar: MatSnackBar,
        private readonly cookie: CookieService,
        private readonly store: Store<State>,
        private readonly translate: TranslateService,
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        this.store.select(UserAction.selector()).pipe(filter(v => !!v))
        .subscribe(user => {
            this.uid = user.id;
        });
    }

    protected obsget<K>(obs: Observable<K>): Observable<K> {
        return obs.pipe(take(1));
    }

    protected selstore<K>(selector: (state: State) => K) {
        return this.store.select(selector);
    }

    protected getstore<K>(selector: (state: State) => K) {
        return this.store.select(selector).pipe(take(1));
    }

    protected dispstore<V extends Action = Action>(action: V) {
        this.store.dispatch(action);
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    init(warningCb: (msg: string) => void): void {
    }

    progress(inProgress: boolean) {
        this.store.dispatch(new InProgressAction(inProgress));
    }

    /**
     * App default behavior to notify http error.
     */
    notifyError(message: string, duration = 0) {
        // Auto calculate duration
        if (0 === duration) {
            // 1 sec for 10 text
            duration = (1 + message.length / 10) * 1000;
        }
        this.snackbar.open(message, undefined, {duration: duration});
    }

    /**
     * Notify general backend error
     */
    notifyBeError(err: any, message?: string, duration = 0) {
        let m = 'Request fails';
        if (DtoCmmn.isResErrInstance(err) && err.code) {
            // Error message depends on server's implementation.
            const e: DtoCmmn.ResErr = err;
            const msg = e.message ? ` (${e.message})` : '';
            m += `: ${e.code}${msg}`;
        } else {
            m += `: Network (${err})`;
        }
        if (message) { m += ' => ' + message; }
        this.notifyError(m, duration);
    }

    notifyInfo(message: string, duration = 0) {
        this.notifyError(message, duration);
    }

    login(uid: string) {
        this.store.dispatch(new UserAction({id: uid}));
    }

    logout() {
        // clear cookie if exists.
        this.cookie.delete(COOKIES.session);
        this.store.dispatch(new UserAction(UserAction.unauthorizedUser()));
    }

    //////////////////////////////////////////////////////////////////////////
    //
    // Route
    //
    //////////////////////////////////////////////////////////////////////////
    routeQuery<T>(pm: ParamMap) {
        try {
            return JSON.parse(pm.get('q'));
        } catch (e) { return undefined; }
    }
    /**
     * Get query object from snapshot of current(activated) route.
     * undefined is retured for invalid query parameters
     */
    routeSnapshotQuery<T>(): T | undefined {
        return this.routeQuery(this.route.snapshot.queryParamMap);
    }

    locationReplaceState<T>(path: string, query?: T) {
        this.location.replaceState(path, 'q=' + encodeURIComponent(JSON.stringify(query)));
    }

    /**
     * Get current location data
     */
    currentRoute<T>(): {path: string, query?: T} {
        const ut = this.router.parseUrl(this.router.url);
        return {
            path: this.router.url.split('?')[0],
            query: this.routeQuery(ut.queryParamMap)
        };
    }

    newQueryParams(query: any): Params {
        return { q: JSON.stringify(query) };
    }
}
