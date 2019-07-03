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
    distinctUntilChanged,
    map,
    tap
} from 'rxjs/operators';
import { State } from '../../app.store';
import {
    UserAction,
    UserPayload
} from '../../root.store';


@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly store: Store<State>,
        private readonly router: Router
    ) {
        // console.log('*** Constructor: Permission Guard');
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        snapshot: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // console.log('>> Permission Guard: ', route);
        return true;
        /*
        return this.authenticationService.isSignedIn().pipe(
            tap((signedIn: boolean): void => {
                if (!signedIn) {
                    const url = state.url.substr(0, state.url.indexOf('?')) || location.pathname;
                    this.authenticationService.redirectInfo = new RedirectInfo(url, route.queryParams, route.fragment);
                    this.router.navigate(['/login']);
                }
            })
        );
        */
    }
}
