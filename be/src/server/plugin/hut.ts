///////////////////////////////////////////////////////////////////////////////
//
// Hapi utilities.
//
///////////////////////////////////////////////////////////////////////////////
import { ok as assert } from 'assert';
import * as Hapi from 'hapi';
import * as hsc from 'http-status-codes';

import { E } from '../../app/error';
import * as DtoCmmn from '../../fbs/dto/cmmn';
import { dbg } from '../../fbs/dbg';
const D = dbg(false);

let debugId = 0;

export const DAY_MS = 24 * 60 * 60 * 1000;
export const WEEK_MS = 7 * DAY_MS;
export const YEAR_MS = 365 * DAY_MS;

export async function hapiResponse(
    h: Hapi.ResponseToolkit,
    f: () => Promise<any>,
    respHook?: (r: Hapi.ResponseObject) => Hapi.ResponseObject,
): Promise<any> {
    const did = debugId++;
    try {
        D.p(`[${did}] Req: `, h.request, '\n\n');
        const r = await f();
        D.p(`[${did}] Res: `, r, '\n\n');
        const resp = h.response(r);
        return respHook ? respHook(resp) : resp;
    } catch (e) {
        // See 'ResErr' type at 'dto/cmmn
        if (undefined === e.statusCode
            || undefined === e.error
            || undefined === e.code
        ) {
            // Unexpected/Unknown error!
            console.warn(e);
            const unknownErr: DtoCmmn.ResErr = {
                statusCode: hsc.INTERNAL_SERVER_ERROR,
                error: hsc.getStatusText(hsc.INTERNAL_SERVER_ERROR),
                /**
                 * This is NOT part of Boom. This is part of user code
                 * Missing 'code' means it's error from Hapi internal or external plugin.
                 */
                code: E.unknown,
            };
            e = unknownErr;
        }
        const hres = h.response(e);
        hres.code(e.statusCode);
        return hres;
}
}

