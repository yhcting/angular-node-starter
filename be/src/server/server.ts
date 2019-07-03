import * as Hapi from 'hapi';
import cfg from './config';
import * as Plugin from './plugin';
import * as DtoCmmn from '../fbs/dto/cmmn';
import { E } from '../fbs/error';

async function create(): Promise<Hapi.Server> {
    const opt: Hapi.ServerOptions = {
        host: cfg.server.host,
        port: cfg.server.port,
        routes: {
            validate: {
                failAction: async (request: Hapi.Request, h: Hapi.ResponseToolkit, err: any) => {
                    // console.log(err);
                    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
                        const r: DtoCmmn.ResErr = {
                            statusCode: 400,
                            error: 'Bad Request',
                            code: E.badRequest,
                            message: err.toString(),
                            body: err.details
                        };
                        return h.response(r).code(r.statusCode).takeover();
                    }
                    throw err;
                }
            },
        }
    };

    const server = new Hapi.Server(opt);
    return server;
}

export async function start() {
    const server = await create();
    await Plugin.visit(server);

    try {
        await server.start();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
