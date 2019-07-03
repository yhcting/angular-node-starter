import {
    Component,
    OnInit,
} from '@angular/core';
import { ComponentBase } from './reusable/component-base';
@Component({
    // All bindings are made up of Observable. Therefore OnPush strategy is valid
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent extends ComponentBase<undefined> implements
OnInit {
    constructor() { super(undefined); }
    ngOnInit() {}
}
