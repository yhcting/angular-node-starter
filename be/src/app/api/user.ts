//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
import * as crypto from 'crypto';
import { ok as assert } from 'assert';
import log from '../logger';
import cfg from '../config';
import * as Er from '../error';
import { E } from '../error';
import * as Dto from '../../fbs/dto/user';

let monoIncreasingSessId = 0;
const sess: {[sid: string]: Sess} = {};

class Sess {
    public tmrId: NodeJS.Timeout; // session expire timeout
    constructor(
        public sid: string, /** session id */
        public uid: string  /** user id */
    ) {}
}

function newSessId(): string {
    return crypto.randomBytes(16).toString('base64')
    + monoIncreasingSessId++
    + crypto.randomBytes(16).toString('base64');
}

function newSession(sid: string, uid: string): Sess {
    sess[sid] = new Sess(sid, uid);
    kickSession(sid);
    return sess[sid];
}

function kickSession(sid: string) {
    const s = sess[sid];
    log.assert(s);
    if (undefined !== s.tmrId) {
        clearTimeout(s.tmrId);
    }
    s.tmrId = setTimeout(() => {
        rmSession(sid);
    }, cfg.sessKeepAliveTtl);
}

function getSession(sid: string): Sess {
    return sess[sid];
}

function rmSession(sid: string) {
    // console.log(`rmSession: ${sid}`);
    const s = sess[sid];
    if (!s) {
        return;
    }
    clearTimeout(s.tmrId);
    delete sess[sid];
}

/**
 * @return session id. undefined if invalid id/pw.
 */
function verifyUser(id: string, pw: string): string {
    let sid: string;
    while (true) {
        sid = newSessId();
        if (undefined === sess[sid]) {
            break;
        }
    }
    return sid;
}


export async function login(req: Dto.LoginReq) {
    const sid = verifyUser(req.id, req.pw);
    Er.a(sid, E.badRequest);
    newSession(sid, req.id);
    const resp: Dto.LoginRes = { sid: sid };
    return resp;
}


export async function logout(req: Dto.LogoutReq, sid: string) {
    const s = getSession(sid);
    if (s) {
        rmSession(sid);
    } else {
        // nothing to logout. (already logged out!)
    }
    const resp: Dto.LogoutRes = {};
    return resp;
}


export async function me(req: Dto.MeReq, sid: string) {
    const s = getSession(sid);
    Er.a(s, E.authentication);
    kickSession(s.sid);
    const resp: Dto.MeRes = { id: s.uid };
    return resp;
}
