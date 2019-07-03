import appCfg from './app/config';
import * as server from './server';
import { init as appInit } from './app/init';

async function main() {
    await appInit();
    await server.start();
}

main().then(undefined, e => { throw e; });
