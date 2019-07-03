import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { MainModule as ExternModule } from '../extern';
import { MainModule as ReusableModule } from '../reusable';

import * as Store from './main.store';
import { RoutingModule } from './routing.module';

import { MainComponent } from './main.component';

@NgModule({
    declarations: [
        MainComponent,
    ],
    imports: [
        StoreModule.forFeature(
            Store.featureName(),
            Store.reducers(),
            Store.config()
        ),
        RoutingModule,
        ExternModule,
        ReusableModule
    ],
    exports: []
})
export class MainModule {}
