// tslint:disable:no-return-await

import { ok as assert, AssertionError } from 'assert';
import * as _ from 'lodash';
import * as Rp from 'request-promise-native';

import cfg from '../app/config';
import * as Er from '../fbs/error';
import { E } from '../fbs/error';
import * as Rest from '../fbs/rest';

import * as DtoUser from '../fbs/dto/user';

import {
    init as appInit,
    exit as appExit
} from '../app/init';
import * as AppUser from '../app/api/user';

const restMode = 'resttest' === cfg.mode.type;


//////////////////////////////////////////////////////////////////////////////
//
// For global setup/teardown for full unit-testing.
//
//////////////////////////////////////////////////////////////////////////////
if (global.before) {
    before(async () => {
        await init();
    });
}

if (global.after) {
    after(async () => {
        await exit();
    });
}

//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
export async function init() {
    // console.log('test init: mode: ', restMode);
    if (!restMode) {
        await appInit();
    }
}

export async function exit() {
    if (!restMode) {
        await appExit();
    }
}

export interface Sess {
    userLogin(req: DtoUser.LoginReq): Promise<DtoUser.LoginRes>;
    userLogout(req: DtoUser.LogoutReq): Promise<DtoUser.LogoutRes>;
    userMe(): Promise<DtoUser.MeRes>;
}


/**
 * NOTE: 'return await' form at async functions is for E.unauthorized-check at 'get sid()';
 * Thrown error at App and 'get sid()' should be handled as same way at caller.
 * Therefore, error at 'get sid()' is also thrown in Promise routine (in async function)
 */
class SessApp implements Sess {
    private _sid: string;

    get sid() {
        Er.a(undefined !== this._sid, E.unauthorized);
        return this._sid;
    }

    set sid(v: string) {
        this._sid = v;
    }

    constructor() {}
    async userLogin(req: DtoUser.LoginReq): Promise<DtoUser.LoginRes> {
        const r = await AppUser.login(_.cloneDeep(req));
        this.sid = r.sid;
        return r;
    }
    async userLogout(req: DtoUser.LogoutReq): Promise<DtoUser.LogoutRes> {
        const r = await AppUser.logout(_.cloneDeep(req), this.sid);
        this.sid = undefined;
        return r;
    }
    async userMe(): Promise<DtoUser.MeRes> {
        return await AppUser.me({}, this.sid);
    }

}

class SessRest implements Sess {
    private req: any;

    constructor() {
        this.req = Rp.defaults({
            jar: Rp.jar(),
            json: true,
            baseUrl: Rest.apiBase
        });
    }

    private async rp(
        method: 'put' | 'post' | 'get' | 'delete',
        rest: Rest.Rest
    ): Promise<any> {
        try {
            switch (method) {
            case 'put':
            case 'post':
                return await this.req[method](rest.uri, {body: rest.body});
            case 'get':
            case 'delete':
                return await this.req[method](rest.uri);
            default:
                throw new AssertionError();
            }
        } catch (e) {
            if (e.error) {
                throw e.error;
            } else {
                throw new AssertionError();
            }
        }
    }

    userLogin(req: DtoUser.LoginReq): Promise<DtoUser.LoginRes> {
        return this.rp('post', Rest.userLogin(req));
    }
    userLogout(req: DtoUser.LogoutReq): Promise<DtoUser.LogoutRes> {
        return this.rp('post', Rest.userLogout(req));
    }
    userMe(): Promise<DtoUser.MeRes> {
        return this.rp('get', Rest.userMe());
    }
}


export async function userLogin(req: DtoUser.LoginReq
): Promise<Sess> {
    const ss = restMode ? new SessRest() : new SessApp();
    await ss.userLogin(req);
    return ss;
}
