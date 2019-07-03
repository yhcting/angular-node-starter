import {
    Component,
    OnInit
} from '@angular/core';

import { Store } from '@ngrx/store';
import { ComponentBase } from '../reusable/component-base';
import {
    AppService,
    BackendService
} from '../core';

import { State } from './main.store';

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent extends ComponentBase<State> implements
OnInit {
    constructor(
        private readonly app: AppService,
        private readonly be: BackendService,
        store: Store<State>
    ) { super(store); }

    ngOnInit() {
    }
}
