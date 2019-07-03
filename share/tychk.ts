//
// Module for type checking
//
import * as Joi from 'joi';

export function validate(v: any, schema: Joi.SchemaLike) {
    return Joi.validate(v, schema).error === null;
}

export function object(v: any): boolean {
    // Using Joi is wastefully slow.
    // return null === Joi.validate(v, Joi.object().required()).error;
    return 'object' === typeof v
        && null !== v
        && !Array.isArray(v);
}

const strArray_SchemaAllowEmpty = Joi.array().items(Joi.string().allow('')).required();
const strArray_SchemaNonEmpty = Joi.array().items(Joi.string().allow('')).required();
export function strArray(v: any, allowEmpty = true): boolean {
    return validate(v, allowEmpty ? strArray_SchemaAllowEmpty : strArray_SchemaNonEmpty);
}

export function isTypeArray(v: any, tystr: string): boolean {
    if (!Array.isArray(v)) { return false; }
    for (const e of v) {
        if (typeof e !== tystr) { return false; }
    }
    return true;
}

