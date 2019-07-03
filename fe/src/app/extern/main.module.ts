import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    HttpClientModule
} from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import * as Mat from '@angular/material';
// NG Translate
import { TranslateModule } from '@ngx-translate/core';

//////////////////////////////////////////////////////////////////////////////
//
// Application common(shared) module.
//
//////////////////////////////////////////////////////////////////////////////
// Module groups
const ANGULAR_MODULES = [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule
];

const CDK_MODULES = [
    ScrollDispatchModule
];

const MAT_MODULES = [
    Mat.MatAutocompleteModule,
    Mat.MatBadgeModule,
    Mat.MatButtonModule,
    Mat.MatButtonToggleModule,
    Mat.MatCardModule,
    Mat.MatCheckboxModule,
    Mat.MatChipsModule,
    Mat.MatStepperModule,
    Mat.MatDatepickerModule,
    Mat.MatDialogModule,
    Mat.MatExpansionModule,
    Mat.MatGridListModule,
    Mat.MatIconModule,
    Mat.MatInputModule,
    Mat.MatListModule,
    Mat.MatMenuModule,
    Mat.MatNativeDateModule,
    Mat.MatPaginatorModule,
    Mat.MatProgressBarModule,
    Mat.MatProgressSpinnerModule,
    Mat.MatRadioModule,
    Mat.MatRippleModule,
    Mat.MatSelectModule,
    Mat.MatSidenavModule,
    Mat.MatSliderModule,
    Mat.MatSlideToggleModule,
    Mat.MatSnackBarModule,
    Mat.MatSortModule,
    Mat.MatTableModule,
    Mat.MatTabsModule,
    Mat.MatToolbarModule,
    Mat.MatTooltipModule,
    Mat.MatTreeModule,
];

const NPM_MODULES = [
];

// AoT requires an exported function for factories

/**
 * External modules having sharing modules.
 */
@NgModule({
    declarations: [
    ],
    imports: [
        ANGULAR_MODULES,
        CDK_MODULES,
        MAT_MODULES,
        NPM_MODULES
    ],
    exports: [
        ANGULAR_MODULES,
        CDK_MODULES,
        MAT_MODULES,
        NPM_MODULES,

        //
        // [ Exporting 'forRoot' modules! ]
        // These are already imported at root module via forRoot()
        //
        TranslateModule,
    ]
})
export class MainModule { }
