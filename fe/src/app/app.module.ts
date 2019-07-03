// import 'zone.js/dist/zone-mix'; /** This is for electron-renderer */
import 'zone.js/dist/zone';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
    HttpClientModule,
    HttpClient
} from '@angular/common/http';

import {
    BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// NG Translate
import {
    TranslateModule,
    TranslateLoader
} from '@ngx-translate/core';
import {
    TranslateHttpLoader
} from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../environments/environment';

import {
    RoutingModule
} from './routing.module';


import * as Store from './app.store';
import {
    AppHttpInterceptor
} from './core/interceptor';
import { MainModule as CoreModule } from './core';
import { MainModule as ExternModule } from './extern';
import { MainModule as ReusableModule } from './reusable';

import { AppComponent } from './app.component';
import { NotfoundComponent } from './notfound.component';
import { RedirectorComponent } from './redirector.component';
import { MainModule as LoginModule } from './@login';
import { MainModule as HomeModule } from './@home';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        RedirectorComponent,
        NotfoundComponent
    ],
    entryComponents: [
    ],
    imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        StoreModule.forRoot(
            Store.reducers(),
            Store.config()
        ),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router'
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production // Restrict extention to log-only mode
        }),
        CoreModule,
        ExternModule,
        ReusableModule,
        LoginModule,
        HomeModule,
        RoutingModule
    ],
    providers: [
        CookieService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
