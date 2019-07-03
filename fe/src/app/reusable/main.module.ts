//////////////////////////////////////////////////////////////////////////////
//
// Components(including Directive) that can be re-usable at other application.
// That is, components not having application dependency!
//
//////////////////////////////////////////////////////////////////////////////
import { NgModule } from '@angular/core';
import { MainModule as ExternModule } from '../extern';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ListEditChipComponent } from './listedit-chip.component';
import { IntegerValidatorDirective } from './integer-validator.directive';
import { CustomValidatorDirective } from './custom-validator.directive';
import { VarsDirective } from './vars.directive';

const COMPONENTS = [
    ConfirmDialogComponent,
    ListEditChipComponent,
];

const DIRECTIVES = [
    IntegerValidatorDirective,
    CustomValidatorDirective,
    VarsDirective
];

const MODULES = [
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    entryComponents: [
        ConfirmDialogComponent
    ],
    imports: [
        // This is already imported with ExternModule.
        // So, we don't need to re-export it.
        ExternModule,
        ...MODULES
    ],
    exports: [
        ...MODULES,
        ...COMPONENTS,
        ...DIRECTIVES
    ]
})
export class MainModule {}
