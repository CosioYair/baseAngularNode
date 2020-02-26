import { AbstractControl, ValidatorFn } from '@angular/forms';

export function isMajor(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const formControl = control.parent;
        const birthdate = control.value;
        if (formControl && birthdate) {
            const validDate = new Date(birthdate.year + 18, birthdate.month, birthdate.day);
            return validDate <= new Date() ? null : { isMajor: { valid: false, value: 'Invalid date' } };
        }
        return null;
    }
}