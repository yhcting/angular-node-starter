import * as Os from 'os';
import { Config } from './index';

const cfg: Config = {
    prjdir: undefined,
    mode: undefined,
    sessKeepAliveTtl: 1000 * 60 * 60, // 1 hour
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

export default cfg;
