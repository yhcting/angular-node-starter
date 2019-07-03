import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppService } from '../service/app.service';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Httpstatus from 'http-status-codes';
import { environment } from '../../../environments/environment';
import * as Rest from '../../fbs/rest';
import { State } from '../../app.store';
import {
    UserAction,
} from '../../root.store';

import { dbg } from '../../fbs/dbg';
const D = dbg(false);

let debugId = 0;

@Injectable({
    providedIn: 'root',
})
export class AppHttpInterceptor implements HttpInterceptor {

    constructor(
        private readonly app: AppService,
        private readonly store: Store<State>,
        private readonly router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const did = debugId++;

        // console.log('>> http interceptor: ', req.url);
        let url: string;
        if (req.url.startsWith('http://')
                || req.url.startsWith('https://')) {
            url = req.url;
        } else if (req.url.startsWith('./')) {
            url = req.url;
        } else {
            if (environment.production) {
                url = Rest.apiBase + req.url;
            } else {
                // For webpack proxy server.
                url = '/api/' + req.url;
            }
        }
        const newreq = req.clone({
            url: url
        });
        D.p(`[${did}] intercept: ${url}`);
        return next.handle(newreq).pipe(tap(
            (v: HttpResponse<any>) => {
                D.p(`[${did}] next: `, v);
            },
            (e: HttpErrorResponse) => {
                D.p(`[${did}] error`);
                if (Httpstatus.UNAUTHORIZED === e.status) {
                    // Set as logout state
                    this.store.dispatch(new UserAction(
                        UserAction.unauthorizedUser()
                    ));
                    // console.log('!!! HttpInterceptor Navigate to /login');
                    this.router.navigate(['/login']);
                }
            },
            () => {
                D.p(`[${did}] complete`);
            })
        );
    }
}
