//////////////////////////////////////////////////////////////////////////////
//
// Application store.
//
//////////////////////////////////////////////////////////////////////////////
import * as NgStore from '@ngrx/store';
import * as Root from './root.store';


//////////////////////////////////////////////////////////////////////////////
//
// State / Reducer / Selector
//
//////////////////////////////////////////////////////////////////////////////
export interface State {
    root: Root.State;
}

export interface AppAction<LocalState> {
    update(s: LocalState): void;
}


// Initialize sub-stores
Root.init(s => s.root);


/*
 * Note: Using selector.
 * =====================
 * Keep in mind that once selector is invoked, result is memorized!
 * => Subscribe may not called due to memorized value(same value) is returned.
 * So, 'selector' is useful for data that is not updated frequently.
 */
//////////////////////////////////////////////////////////////////////////////
//
// Meta Reducers
//
//////////////////////////////////////////////////////////////////////////////
// Prefix for app meta reducers.
const PREF = '/';

// console.log all actions
function logger(reducer: NgStore.ActionReducer<State>
): NgStore.ActionReducer<State> {
    return function(state: State, action: any): State {
        // console.log('state', state);
        // console.log('action', action);
        return reducer(state, action);
    };
}

function clear(reducer: NgStore.ActionReducer<State>
): NgStore.ActionReducer<State> {
    return function(state: State, action: NgStore.Action): State {
        if (Root.atUser === action.type) {
            // In case of current user is changed, clear all state!
            const ua = <Root.UserAction>action;
            let uid;
            if (state && state.root && state.root.user) {
                uid = state.root.user.id;
            }
            if (ua.payload.id !== uid) {
                state = undefined;
            }
        }
        return reducer(state, action);
    };
}

/*
export const metaReducers: ngstore.MetaReducer<State>[] = !environment.production
    ? [logger]
    : [];
*/
export const metaReducers: NgStore.MetaReducer<State>[] = [
    clear
];


//////////////////////////////////////////////////////////////////////////////
//
// Injection
//
//////////////////////////////////////////////////////////////////////////////
export function reducers(): NgStore.ActionReducerMap<State> {
    return {
        root: Root.reducer
    };
}

export function config(): any {
    // See StoreConfig
    return {
        metaReducers: metaReducers
    };
}
