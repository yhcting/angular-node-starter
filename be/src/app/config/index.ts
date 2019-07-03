import { ok as assert } from 'assert';

type ModeType = 'unittest' | 'resttest' | 'development' | 'production';
const ModeType = new Set(['unittest', 'resttest', 'development', 'production']);

export enum DbgLv {
    No = 0,
    Basic = 1,
    Strict = 2
}
export interface Config {
    prjdir: string; /** project directory - absolute path */
    mode: {
        type: ModeType;
        dbglv: DbgLv;
    };

    sessKeepAliveTtl: number; /** Session Keep Alive Time. */
    /** external databases */
    db: {
        mongo: {
            host: string;
            port: number;
            user: string;
            password: string;
            dbname: string;
            collection: string;
        }
    };
}

const dev: Config = {
    // These are set at runtime.
    prjdir: undefined,
    mode: undefined,
    sessKeepAliveTtl: 1000 * 60 * 60 * 24 * 7,
    db: {
        mongo: {
            host: 'localhost',
            port: 27017,
            user: 'taskVote',
            password: 'taskVote',
            dbname: 'taskVote',
            collection: 'vote'
        }
    },
};

export const cfg: Config = ('production' === process.env['NODE_ENV']
         ? {...dev, ...require('./prod')} // overwriting prod config.
         : dev);

cfg.prjdir = process.cwd();

function getMode(): Config['mode'] {
    let nodeenv = <any>process.env['NODE_ENV'];
    nodeenv = nodeenv ? nodeenv : 'development,strict';
    const ns = nodeenv.split(',');
    const type = ns[0];
    assert(ModeType.has(type));
    let dlstr = ns[1];
    if (undefined === dlstr) {
        switch (type) {
        case 'unittest':
        case 'resttest':
            dlstr = 'strict';
            break;
        case 'development':
            dlstr = 'basic';
            break;
        case 'production':
            dlstr = 'no';
            break;
        }
    }
    let dbglv = DbgLv.Strict;
    switch (dlstr) {
        case 'no': dbglv = DbgLv.No; break;
        case 'basic': dbglv = DbgLv.Basic; break;
        case 'strict': dbglv = DbgLv.Strict; break;
        default: assert(false);
    }
    return {
        type: ns[0],
        dbglv: dbglv
    };
}

if (!cfg.mode) {
    cfg.mode = getMode();
}

export default cfg;
