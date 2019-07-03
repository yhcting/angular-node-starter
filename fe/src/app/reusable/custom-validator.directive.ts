import { Directive } from '@angular/core';
import {
    Input
} from '@angular/core';
import {
    Validator,
    AbstractControl,
    NG_VALIDATORS
} from '@angular/forms';


export type CustomValidator = (v: string) => null | {[k: string]: string};

@Directive({
    selector: '[appCustomValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: CustomValidatorDirective,
        multi: true
    }]
})
export class CustomValidatorDirective implements Validator {
    @Input('appCustomValidator') f: CustomValidator;

    validate(control: AbstractControl): {[key: string]: any} | null {
        try {
            return this.f(control.value);
        } catch (e) {
            return { appCustomValidator: e.toString() };
        }
    }
}
