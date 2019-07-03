import * as hapi from 'hapi';
import * as inert from 'inert';

import cfg from '../config';

const routes: hapi.ServerRoute[] = [{
    method: 'GET',
    path: '/{param*}',
    options: {
        auth: {
            mode: 'optional'
        },
    },
    handler: {
        directory: {
            path: 'public'
        }
    }
}];

export async function visit(server: hapi.Server) {
    console.log('Register plugin: fe(frontend)');
    await server.register(inert);
    server.route(routes);
}
