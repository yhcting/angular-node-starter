import { Err as ErrBase } from '../fbs/error';
export { E } from '../fbs/dto/cmmn';
import { E } from '../fbs/dto/cmmn';

export class Err extends ErrBase<E> {
}

export function ethrow(e: E, m?: string, body?: any): never {
    throw new Err(e, m, body);
}

/**
 * Assert Verification. Frequently used. So, name is simplified as 'a'.
 */
export function a(cond: any, e: E, msg?: string, body?: any) {
    if (!cond) {
        throw new Err(e, msg, body);
    }
}
