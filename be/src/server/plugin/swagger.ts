import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';

import { cfg } from '../config';

const plugin = require('hapi-swagger');

const options = {
    info: {
        title: 'JCM API Documentation',
        version: '0.0.1'
    }
};

export async function visit(server: Hapi.Server) {
    if (cfg.prod) { return; }
    console.log('Register plugin: swagger');
    await server.register(Inert);
    await server.register(Vision);
    await server.register({
        plugin: plugin,
        options: options
    });
}
