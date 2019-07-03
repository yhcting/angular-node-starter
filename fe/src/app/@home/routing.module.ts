import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule,
} from '@angular/router';
import { LoginGuard } from '../core/guard/login.guard';
import { MainComponent } from './main.component';

export const ROUTES: Routes = [
    {
        path: 'home',
        canActivate: [ LoginGuard ],
        children: [
            { path: '', component: MainComponent },
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
