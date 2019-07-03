//
// Common
//
import * as Joi from 'joi';
import { E as FbsE } from '../error';

// String is used for readability
export enum DtoE {
    assert = 'assert',
    unknown = 'unknown',
    notImplemented = 'notImplemented',
    exist = 'exist',  // already exist.
    notFound = 'notFound',
    sizeExceeded = 'sizeExceeded',
    badRequest = 'badRequest',
    permission = 'permission',
    nothingToDo = 'nothingToDo',
    authentication = 'authentication',
    forbidden = 'forbidden',
    //
    // Low-level database
    //
    fs = 'fs', // unknown at filesystem.
    database = 'database', // other database
}

export type E = DtoE | FbsE;
export const E = { ...DtoE, ...FbsE };


//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
/**
 * Boom error payload is used at hapi-internal and some external plugins.
 * (Especially, for authentication system of hapi.)
 * See https://hapijs.com/tutorials/auth : Schema->authenticate section.
 */
export interface ResErr {
    statusCode: number;
    error: string; /** comes from 'statusCode (above) */
    /**
     * This is NOT part of Boom. This is part of user code
     * Missing 'code' means it's error from Hapi internal or external plugin.
     */
    code?: E;
    message?: string;
    body?: any; /** Any addition information object for error */
}
export function isResErrInstance(e: any) {
    return Joi.validate(e, Joi.object({
        statusCode: Joi.number().required(),
        error: Joi.string().required(),
        code: Joi.string().optional(),
        message: Joi.string().allow('').optional(),
        body: Joi.any().optional()
    })).error === null;
}
