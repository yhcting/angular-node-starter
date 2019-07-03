import * as Path from 'path';
import { ok as assert } from 'assert';
let refcnt = 0;

export async function init() {
    assert(refcnt >= 0);
    if (0 < refcnt++) { return; }
}

export async function exit() {
    assert(refcnt >= 0);
    if (0 < --refcnt) { return; }
}
