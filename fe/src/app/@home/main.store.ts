import {
    ActionReducerMap
} from '@ngrx/store';

import * as App from '../app.store';
import * as Root from './root.store';

export interface MainState {
    root: Root.State;
}

export interface State extends App.State {
    home: MainState;
}

// Initialize sub-stores
Root.init(s => s.home.root);

//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
export function featureName(): keyof State {
    return 'home';
}

export function reducers(): ActionReducerMap<MainState> {
    return {
        root: Root.reducer
    };
}

export function config(): any {
    return undefined;
}

// export const selectHomeState = createFeatureSelector<MainState>('home');
/*
export const selectChartNumSpf = createSelector(
    selectHomeState,
    state => state.root.chart.numSpf
);
*/
