import {
    ActionReducerMap
} from '@ngrx/store';

import * as App from '../app.store';
import * as Root from './root.store';
export interface MainState {
    root: Root.State;
}

export interface State extends App.State {
    login: MainState;
}

// Initialize sub-stores
Root.init(s => s.login.root);

//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
export function featureName(): keyof State {
    return 'login';
}

export function reducers(): ActionReducerMap<MainState> {
    return {
        root: Root.reducer,
    };
}
export function config(): any {
    return undefined;
}

// export const selectWalletState = createFeatureSelector<UserState>('user');
