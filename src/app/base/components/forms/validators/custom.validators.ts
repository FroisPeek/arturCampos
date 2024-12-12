import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static emailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const email = control.value;


            if (!email || email.length < 4) {
                return { invalid: true };
            }

            const parts = email.split('@');
            if (parts.length !== 2) {
                return { invalid: true };
            }

            const localPart = parts[0];
            const domainPart = parts[1];

            if (localPart.length === 0 || !/^[a-zA-Z0-9_.-/+]+$/.test(localPart)) {
                return { invalid: true };
            }

            const domainSegments = domainPart.split('.');
            if (domainSegments.length < 2) {
                return { invalid: true };
            }


            for (let i = 0; i < domainSegments.length; i++) {
                const segment = domainSegments[i];
                if (segment.length === 0 || !/^[a-zA-Z0-9-]+$/.test(segment)) {
                    return { invalid: true };
                }
            }

            return null;
        };
    }

    static phoneValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const phone = control.value;

            if (!phone) {
                return null;
            }

            const numericPhone = phone.replace(/\D/g, '');
            if (!(numericPhone.length >= 10 && numericPhone.length <= 11)) {
                return { invalid: true };
            }

            if (numericPhone.length === 11 && parseInt(numericPhone.substring(2, 3), 10) !== 9) {
                return { invalid: true };
            }

            for (let n = 0; n < 10; n++) {
                if (
                    numericPhone === new Array(11).join(String(n)) ||
                    numericPhone === new Array(12).join(String(n))
                ) {
                    return { invalid: true };
                }
            }

            const validAreaCodes = [
                11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
                37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63,
                65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
                89, 91, 92, 93, 94, 95, 96, 97, 98, 99
            ];
            const areaCode = parseInt(numericPhone.substring(0, 2), 10);
            if (validAreaCodes.indexOf(areaCode) === -1) {
                return { invalid: true };
            }

            if (new Date().getFullYear() >= 2017) {
                if (numericPhone.length === 10 && [2, 3, 4, 5, 7].indexOf(parseInt(numericPhone.substring(2, 3), 10)) === -1) {
                    return { invalid: true };
                }
            }

            return null;
        };
    }
}
