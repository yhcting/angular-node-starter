import * as Winston from 'winston';
import { E, ethrow } from './error';

export enum Level {
    FATAL = -1,
    ERROR = 0,
    WARN,
    INFO,
    DEBUG,
    VERBOSE
}

const winstonLogger = Winston.createLogger({
    level: 'silly',
    transports: [
        new (Winston.transports.Console)()
    ]
});

let micntr_ = 0; // Monolithic Increasing CouNTeR
function micntr() {
    return micntr_++;
}

class Logger {
    protected logger: Winston.Logger;
    constructor(
        protected readonly namespace: string,
        protected readonly lv: Level,
    ) {
        this.logger = winstonLogger;
    }

    private isDevMode() {
        return this.lv > Level.INFO;
    }

    // logging functions
    lg(lv: Level, ...args: any[]) {
        if (lv > this.lv) { return; }
        const tm = Date.now();
        /*
        const msgs: string[] = [];
        for (const arg of args) {
            if ('string' !== typeof arg) {
                msgs.push(JSON.stringify(arg, undefined, 2));
            }
        }
        const logmsg = `[${tm}] ${msgs.join(' ')}`;
        // (<any>this.logger)['silly'](logmsg);
        */
        console.log(`[${tm}]`, ...args);
    }

    // debugging execution
    async ex(lv: Level, f: () => void | Promise<void>) {
        if (lv > this.lv) { return; }
        await f();
    }

    // Time duration logging.
    async tm<T>(lv: Level, msg: string, f: () => T | Promise<T>): Promise<T> {
        const id = micntr();
        let tm = -Date.now();
        this.lg(lv, `<${id}> >>> ${msg}`);
        try {
            return await f();
        } finally {
            tm += Date.now();
            this.lg(lv, `<${id}> <<< ${msg} (${tm}ms)`);
        }
    }

    tmv<T>(msg: string, f: () => T | Promise<T>) { return this.tm(Level.VERBOSE, msg, f); }
    tmd<T>(msg: string, f: () => T | Promise<T>) { return this.tm(Level.DEBUG, msg, f); }
    tmi<T>(msg: string, f: () => T | Promise<T>) { return this.tm(Level.INFO, msg, f); }
    tmw<T>(msg: string, f: () => T | Promise<T>) { return this.tm(Level.WARN, msg, f); }

    exv(f: () => void | Promise<void>) { return this.ex(Level.VERBOSE, f); }
    exd(f: () => void | Promise<void>) { return this.ex(Level.DEBUG, f); }
    exi(f: () => void | Promise<void>) { return this.ex(Level.INFO, f); }
    exw(f: () => void | Promise<void>) { return this.ex(Level.WARN, f); }

    v(...args: any[]) { this.lg(Level.VERBOSE, ...args); }
    d(...args: any[]) { this.lg(Level.DEBUG, ...args); }
    i(...args: any[]) { this.lg(Level.INFO, ...args); }
    w(...args: any[]) { this.lg(Level.WARN, ...args); }
    /**
     * Message is printed. And then assert.
     */
    e(...args: any[]): void {
        this.lg(Level.ERROR, ...args);
        if (this.lv >= Level.ERROR) {
            ethrow(E.assert);
        }
    }

    /**
     * Message is printed to stderr. And process is exited
     */
    fatal(message?: any, err?: any, exitcode=1): never {
        console.error(`FATAL: ${this.namespace} ${message ? message : ''}`);
        console.error(err ? err : '');
        console.trace();
        return process.exit(exitcode);
    }

    assert(cond: any, message?: any): void {
        if (!cond) { this.e(message ? message : 'ASSERT'); }
    }

    assertFatal(cond: any, message?: any): void {
        if (!cond) {
            this.fatal(message ? message : 'ASSERT-FATAL');
        }
    }

    async mustNotFail<T>(
        f: () => T | Promise<T>,
        logOnFail?: string
    ): Promise<T> {
        try {
            return await f();
        } catch (e) {
            return this.fatal(logOnFail ? logOnFail : '', e);
        }
    }
}

const MAIN_NAMESPACE = '$';

const loggers = new Map<string, Logger>();
export const mainLogger = new Logger(MAIN_NAMESPACE, Level.INFO);
loggers.set(MAIN_NAMESPACE, mainLogger);

export function getLogger(namespace=MAIN_NAMESPACE, level=Level.INFO): Logger {
    // [TODO]
    // Write code for centralized control regarding logging, here!
    // At this moment, all loggings are allowed.
    let l = loggers.get(namespace);
    if (!l) {
        l = new Logger(namespace, level);
        loggers.set(namespace, l);
    }
    return l;
}

//////////////////////////////////////////////////////////////////////////////
//
// Log decorator
//
//////////////////////////////////////////////////////////////////////////////
/**
 * Method Decorator
 */
export function tmlog(lv = Level.DEBUG, tag?: string) {
    return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (undefined === descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const orig = descriptor.value;
        descriptor.value = function () {
            tag = tag ? `[${tag}]` : '';
            const id = micntr();
            mainLogger.lg(lv, `@@@ <${id}> >>> ${key.toString()} ${tag}`);
            let tm = -Date.now();
            const r = orig.apply(this, arguments);
            if (r instanceof Promise) {
                return r.finally(() => {
                    tm += Date.now();
                    mainLogger.lg(lv, `@@@ <${id}> <<< ${key.toString()} ${tag} (${tm}ms)`);
                });
            } else {
                tm += Date.now();
                mainLogger.lg(lv, `@@@ <${id}> <<< ${key.toString()} ${tag} (${tm}ms)`);
                return r;
            }
        };
        return descriptor;
    };
}

export default mainLogger;
