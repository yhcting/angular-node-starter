import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
    map,
    share,
    tap,
    take,
    catchError,
    distinctUntilChanged
} from 'rxjs/operators';
import {
    of,
    throwError,
    Subject,
    Subscription,
    Observable
} from 'rxjs';
import * as _ from 'lodash';
import * as Er from '../../error';
import { E } from '../../error';
import { State } from '../../app.store';
import { InProgressAction } from '../../root.store';
import * as DtoUser from '../../fbs/dto/user';
import { E as BeE} from '../../fbs/dto/cmmn';
import * as Rest from '../../fbs/rest';
import { dbg } from '../../fbs/dbg';
import { log } from '../../fbs/deco/method/log';

const D = dbg(false);

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    constructor(
        private readonly store: Store<State>,
        private readonly httpClient: HttpClient
    ) {
        D.p('[Constructor] BackendService');
    }

    /**
     * TODO: Improve error message.
     */
    private httpErrorTranslator(e: HttpErrorResponse): Observable<never> {
        let ec: Er.E;
        if (e.error && e.error.code) {
            // Error thrown by backend biz logic.
            return throwError(e.error);
        } else {
            switch (e.status) {
            case 0: ec = E.network; break;
            default: ec = E.network; break;
            }
            return throwError(new Er.Err(ec));
        }
    }

    private execHttp<T>(httpObservable: Observable<T>, progress = true): Observable<T> {
        // @ngrx/store is directly used instead of 'AppService' to remove
        //   dependency from 'backend.service' to 'app.service'
        // (To avoid potential cyclic dependency for future.)
        const prog = (v: boolean) => {
            if (progress) {
                this.store.dispatch(new InProgressAction(v));
            }
        };

        prog(true);
        return new Observable<T>(obs => {
            httpObservable.subscribe(
                v => obs.next(v),
                e => {
                    D.p('...exechttp: E ', e);
                    prog(false);
                    obs.error(e);
                },
                () => {
                    D.p('...exechttp: complete ');
                    prog(false);
                    obs.complete();
                }
            );
        }).pipe(catchError(e => this.httpErrorTranslator(e)));
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    userLogin(req: DtoUser.LoginReq, progress = true) {
        const rest = Rest.userLogin(req);
        return this.execHttp(
           this.httpClient.post<void>(rest.uri, rest.body),
           progress
        );
    }

    userLogout(progress = true) {
        const rest = Rest.userLogout({});
        return this.execHttp(
           this.httpClient.post<void>(rest.uri, rest.body),
           progress
        );
    }

    userMe(progress = true) {
        const rest = Rest.userMe();
        return this.execHttp(
            this.httpClient.get<DtoUser.MeRes>(rest.uri),
            progress
        );
    }
}
