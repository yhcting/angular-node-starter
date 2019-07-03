//////////////////////////////////////////////////////////////////////////////
//
// ngrx/store for Project-root.
//
//////////////////////////////////////////////////////////////////////////////
import * as Ngstore from '@ngrx/store';

import { AppAction } from '../app.store';
// Cyclic import!. But, this is only for type. So not an issue.
import { State as AppState } from './main.store';

const PREF = 'Login/root/';
//////////////////////////////////////////////////////////////////////////////
//
// State
//
//////////////////////////////////////////////////////////////////////////////
export class State {
    constructor(
        public dummy: DummyPayload
    ) { }
}

const initialState = () => new State(
    undefined
);

type MySelector<T> = (state: AppState) => T;
let mystate: MySelector<State>;

//////////////////////////////////////////////////////////////////////////////
//
// Action
//
//////////////////////////////////////////////////////////////////////////////
type MyAction = AppAction<State>;

const atDummy = PREF + 'dummy';

export interface DummyPayload {
    dummy: number;
}
export class DummyAction implements
Ngstore.Action, MyAction {
    readonly type = atDummy;
    constructor(
        public readonly payload: DummyPayload
    ) {}
    static selector(): MySelector<DummyPayload> {
        return (s) => mystate(s).dummy;
    }
    update(s: State) {
        s.dummy = this.payload;
    }
}

export type Action =
    DummyAction
    ;



//////////////////////////////////////////////////////////////////////////////
//
// Reducer
//
//////////////////////////////////////////////////////////////////////////////
export function init(selector: MySelector<State>) {
    mystate = selector;
}

export function reducer(
    state: State = initialState(),
    action: Action
): State {
    // Early filtering.
    if (!action.type.startsWith(PREF)) {
        return state;
    }
    if (undefined === action.update) {
        console.warn(`Unknown handled action type: ${action.type}`);
    } else {
        (<MyAction>action).update(state);
    }
    return state;
}


//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
