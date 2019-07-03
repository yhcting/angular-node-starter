import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    take,
    skipWhile,
    distinctUntilChanged,
    map,
    tap
} from 'rxjs/operators';
import { State } from '../../app.store';
import {
    UserAction,
    UserPayload
} from '../../root.store';
import { dbg } from '../../fbs/dbg';
const D = dbg(false);

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    private login$: Observable<UserPayload>;

    constructor(
        private readonly store: Store<State>,
        private readonly router: Router
    ) {
        this.login$ = this.store.pipe(
            select(state => state.root.user),
            distinctUntilChanged()
        );

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        snapshot: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        D.p('>>> Login guard');
        return new Observable(obs => {
            this.login$.pipe(
                skipWhile(v => undefined === v),
                take(1)
            ).subscribe(v => {
                if (UserAction.isUnauthorizedUser(v)) {
                    D.p('!!! LoginGuard Navigate to /login');
                    this.router.navigate(['/login']);
                    obs.next(false);
                    obs.complete();
                } else {
                    obs.next(true);
                    obs.complete();
                }
            });
        });
    }
}
