//////////////////////////////////////////////////////////////////////////////
//
// Only for session management.
// User account management is covered by 'ac' module (See ac.ts).
//
//////////////////////////////////////////////////////////////////////////////

export interface LoginReq {
    id: string;
    pw: string;
}
// token may be used as cookie for login session.
export interface LoginRes {
    sid: string; /** Session Id. Usually this will be set as cookie */
}

export interface LogoutReq {}
/** token may be used as cookie for login session. */
export interface LogoutRes {}

export interface MeReq {}
export interface MeRes {
    id: string; /** user id */
}

export type Res =
    LoginRes
    | LogoutRes
    | MeRes
    ;
