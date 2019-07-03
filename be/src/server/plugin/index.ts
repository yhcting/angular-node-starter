import * as Hapi from 'hapi';

import cfg from '../config';
import * as Swagger from './swagger';
import * as Fe from './fe';
import * as Auth from './auth';
import * as User from './user';


// Order is matter especially for 'Fe' module.
export async function visit(server: Hapi.Server) {
    // Auth plugin should be the first one because of setting auth strategy.
    await Auth.visit(server);

    let proms = [
        Fe.visit(server),
        User.visit(server)
    ];

    if (!cfg.prod) {
        proms = [...proms,
            Swagger.visit(server),
        ];
    }

    await Promise.all(proms);
}
