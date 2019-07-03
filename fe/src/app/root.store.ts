//////////////////////////////////////////////////////////////////////////////
//
// ngrx/store for App-root.
//
// TODO: As file is growing, refactoring may be required.
// This file may need to be refactored to
// - root.state.ts
// - root.reducer.ts
// - root.action.ts
//
//////////////////////////////////////////////////////////////////////////////
import * as Ngstore from '@ngrx/store';
import {
    State as AppState,
    AppAction,
} from './app.store';

const PREF = 'Root/';
//////////////////////////////////////////////////////////////////////////////
//
// State
//
//////////////////////////////////////////////////////////////////////////////
// Shared per-domain state.
// At this moment, this is shared by '@dmn' and '@grp'
export class State {
    constructor(
        public user: UserPayload,
        public inProgressCount: number,
    ) {}
}

const initialState = () => new State(
    undefined,
    0,
);

type MySelector<T> = (state: AppState) => T;
let mystate: MySelector<State>;

//////////////////////////////////////////////////////////////////////////////
//
// Action
//
//////////////////////////////////////////////////////////////////////////////
type MyAction = AppAction<State>;

//
// NOTE: reducer gets all actions.
// That is, action is NOT modulized
// (see dispatch function. Only action is argument.)
// To avoid action-name-conflict, prefix is added
//
// atUser is referenced at meta reducer!
export const atUser = PREF + 'user'; /** current user information. undefined means 'login required' */
const atInProgress = PREF + 'inProgress';

/**
 * undefined: User session information is not initialized.
 * unauthorizedUser(null): There is no valid session.
 * {id: ...}: Valid session is established, And basic user information is known.
 */
export type UserPayload = {
    id: string | null;
} | undefined;
export class UserAction implements
Ngstore.Action, MyAction {
    static readonly unauthorizedUser = () => ({id : null});
    static readonly isUnauthorizedUser = (u: UserPayload) => undefined === u || null === u.id;
    readonly type = atUser;
    constructor(
        public readonly payload: UserPayload
    ) {}
    static selector(): MySelector<UserPayload> {
        return (s) => mystate(s).user;
    }
    update(s: State) {
        s.user = this.payload;
    }
}

export type InProgressPayload = boolean;
export class InProgressAction implements Ngstore.Action {
    readonly type = atInProgress;
    constructor(
        public readonly payload: InProgressPayload
    ) {}
    static selector(): MySelector<InProgressPayload> {
        return (s) => mystate(s).inProgressCount > 0;
    }
    update(s: State) {
        s.inProgressCount += this.payload ? 1 : -1;
        if (s.inProgressCount < 0) {
            s.inProgressCount = 0;
        }
    }
}

export type Action =
    UserAction
    | InProgressAction
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
