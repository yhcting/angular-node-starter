import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule,
} from '@angular/router';

import { LoginPageGuard } from '../core/guard/login-page.guard';
import { MainComponent } from './main.component';

export const ROUTES: Routes = [
    {
        path: 'login',
        canActivate: [ LoginPageGuard ],
        children: [
            { path: '', component: MainComponent, pathMatch: 'full' },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    exports: [RouterModule]
})
export class RoutingModule { }
