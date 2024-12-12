import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'breakText'
})
export class BreakTextPipe implements PipeTransform {
    transform(value: string | string[] | number, maxLength: number = 64): string {
        if (typeof value === 'number') {
            return value.toString();
        }

        if (!value) {
            return '';
        }

        const text = Array.isArray(value) ? value.join(', ') : value;

        const words = text.split(' ');
        let result = '';
        let lineLength = 0;

        for (const word of words) {
            if (lineLength + word.length > maxLength) {
                result += '<br>' + word;
                lineLength = word.length;
            } else {
                result += (result ? ' ' : '') + word;
                lineLength += word.length + 1;
            }
        }

        return result;
    }
}