import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'typeManagerBoxPipe'
})

export class TypeManagerBoxPipe implements PipeTransform {

    transform(value: number): any {

        let type = '';
        if (value == 1) {
            type = 'Propietario';
        } else if (value == 2) {
            type = 'Suplente';
        } else {
            type = 'Tercer Tipo';
        }
        return type;
    }
}
