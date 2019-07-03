//////////////////////////////////////////////////////////////////////////////
//
// Application core modules excluding UI module - ex. components, directives
//
//////////////////////////////////////////////////////////////////////////////
import {
    NgModule,
    Optional,
    SkipSelf
} from '@angular/core';

import {
    HTTP_INTERCEPTORS,
    HttpClientModule,
    HttpClient
} from '@angular/common/http';
import {
    AppHttpInterceptor
} from './interceptor';
// import { ElectronService } from './electron.service';
import {
    BackendService,
    AppService
} from './service';

/**
 * See https://angular.io/guide/singleton-services for details
 */
@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppHttpInterceptor,
            multi: true
        },
        BackendService,
        AppService
    ]
})
export class MainModule {
    constructor (@Optional() @SkipSelf() parentModule: MainModule) {
        if (parentModule) {
            throw new Error(
            'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
