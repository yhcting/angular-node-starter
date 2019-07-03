//////////////////////////////////////////////////////////////////////////////
//
// REST API Utilities: DTO to REST API.
//
//////////////////////////////////////////////////////////////////////////////
import { ok as assert } from 'assert';
import * as _ from 'lodash';

import * as DtoUser from './dto/user';
export const apiBase = 'http://localhost:8020/api/';

export class Rest {
    constructor(
        public readonly uri: string,
        public readonly body?: any
    ) {}
}

export function userLogin(req: DtoUser.LoginReq) {
    return new Rest(
        'user/login',
        req
    );
}

export function userLogout(req: DtoUser.LogoutReq) {
    return new Rest(
        'user/logout',
        req
    );
}

export function userMe() {
    return new Rest('user/me');
}

//////////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////////
