import { Directive, Input } from '@angular/core';
import * as Joi from 'joi';

@Directive({
    selector: '[appVars]',
    exportAs: 'appVars'
})
export class VarsDirective {

    @Input('appVars') set __appVars(o: any ) {
        if (null !== Joi.validate(o, Joi.object()).error) {
            throw Error('Invalid usage AppVars: Only object is allowed');
        }
        Object.assign(this, o);
    }

    constructor( ) {
    }
}
