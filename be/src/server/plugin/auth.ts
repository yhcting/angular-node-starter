import * as Crypto from 'crypto';
import * as Hapi from 'hapi';
const authcookie = require('hapi-auth-cookie');

import { COOKIES } from '../../fbs/cookie';
import * as App from '../../app/api/user';
import appCfg from '../../app/config';

export class SessObj {
    constructor(
        public readonly sid: string
     ) {}
}

export async function visit(server: Hapi.Server) {
    const prod = 'production' === process.env['NODE_ENV'];
    console.log(`Register plugin: auth:  ${prod}`);
    await server.register(authcookie);
    server.auth.strategy('session', 'cookie', {
        password: Crypto.randomBytes(16).toString('hex'),
        cookie: COOKIES.session,
        // redirectTo: '/api/user/login',
        isHttpOnly: false, // To handled by FE javascript.
        isSecure: false, // TODO: http => https.
        // This is VERY IMPORTANT for SECURITY!
        // Check browser version supporting same-site cookie.
        // And old browser(that doesn't support same-site cookie) SHOULD NOT
        //   be supported.
        isSameSite: prod ? 'Strict' : false,
        // NOTE: ttl is re-set whenever auth. validate is executed.
        // That is, cookie is expired after 'ttl' times since last auth. validation.
        ttl: appCfg.sessKeepAliveTtl,
        keepAlive: true,
        validateFunc: async (request: Hapi.Request, sessObj: SessObj) => {
            // console.log('REQUEST: ', request);
            // console.log('Auth: ', sessObj);
            try {
                await App.me({}, sessObj.sid);
                return {valid: true};
            } catch (e) {
                return {valid: false};
            }
        }
    });
    server.auth.default('session');
}

