import {
    Input,
    Directive
} from '@angular/core';
import {
    Validator,
    AbstractControl,
    NG_VALIDATORS
} from '@angular/forms';
import * as Joi from 'joi';

export interface IntegerValidatorArg {
    min?: number;
    max?: number;
}

@Directive({
    selector: '[appIntegerValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: IntegerValidatorDirective,
        multi: true
    }]
})
export class IntegerValidatorDirective implements Validator {
    @Input('appIntegerValidator') arg: IntegerValidatorArg;

    validate(control: AbstractControl): {[key: string]: any} | null {
        const o: IntegerValidatorArg = this.arg;
        const v = Number(control.value);
        if (null === Joi.validate(v, Joi
            .number()
            .integer()
            .min(o.min)
            .max(o.max)
            .required()).error
        ) {
            return null;
        } else {
            return { appInteger: `required: ${this.arg}`};
        }
    }
}
