import * as Hapi from 'hapi';
import * as Joi from 'joi';

import { hapiResponse } from './hut';
import * as App from '../../app/api/user';
import { SessObj } from './auth';

///////////////////////////////////////////////////////////////////////////////
//
// Shared Joi Validators Schemas(jvs) - Schema
// Limitation
// - Joi doesn't support async validator.
//
///////////////////////////////////////////////////////////////////////////////
const routes: Hapi.ServerRoute[] = [
{
    method: 'POST',
    path: '/login',
    options: {
        description: 'Login',
        notes: 'login',
        tags: ['api'],
        auth: {
            mode: 'try'
        },
        plugins: {
            'hapi-auth-cookie': {
                redirectTo: false
            }
        },
        validate: {
            payload: Joi.object({
                id: Joi.string().required().description(
                    'User id'),
                pw: Joi.string().required(),
            }).required()
        }
    },
    handler: function (request, h) {
        // console.log(request);
        const payload: any = request.payload;
        return hapiResponse(h,
            async () => {
                const r = await App.login({
                    id: payload.id,
                    pw: payload.pw
                });
                request.cookieAuth.set(new SessObj(r.sid));
                return {};
            }
        );
    }
},
{
    method: 'POST',
    path: '/logout',
    options: {
        description: 'Logout',
        notes: 'logout',
        tags: ['api'],
        validate: {}
    },
    handler: function (request, h) {
        // console.log(request);
        const so: SessObj = <any>(request.auth.credentials);
        return hapiResponse(h,
            async () => {
                await App.logout({}, so.sid);
                request.cookieAuth.clear();
                return {};
            }
        );
    }
},
{
    method: 'GET',
    path: '/me',
    options: {
        description: 'My profile',
        notes: 'my prfile after login',
        tags: ['api'],
        validate: {}
    },
    handler: function (request, h) {
        const so: SessObj = <any>(request.auth.credentials);
        return hapiResponse(h,
            () => App.me({}, so.sid)
        );
    }
}
];

///////////////////////////////////////////////////////////////////////////////
export async function visit(server: Hapi.Server) {
    console.log('Register plugin: users');
    await server.register({
        name: 'user',
        version: '0.0.1',
        register: function (_server: Hapi.Server, options: any) {
            _server.route(routes);
        }
    }, {
        routes: {
            prefix: '/api/user'
        }
    });
}

