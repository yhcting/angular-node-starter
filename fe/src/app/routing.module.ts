import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule,
} from '@angular/router';

import { NotfoundComponent } from './notfound.component';
import { RedirectorComponent } from './redirector.component';

/*
 * NOTE: string value of loadChildren looks evaluated before typescript compilation.
 * So, something like `/path/${expression}/path`, is NOT allowed
 *   => leads to angular compilation error.
 * it should be pure string.
 */
export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'notfound',
        component: NotfoundComponent
    },
    {
        path: 'redirector',
        component: RedirectorComponent
    },
    {
        path: '**',
        redirectTo: 'notfound'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES, {
            // USE url Fragment! This is SPA!
            useHash: true,
            enableTracing: false
        }),
    ],
    exports: [RouterModule]
})
export class RoutingModule { }
