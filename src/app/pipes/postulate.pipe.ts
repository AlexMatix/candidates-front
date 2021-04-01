import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'postulatePipe'
})

export class PostulatePipe implements PipeTransform {

    transform(value: number): any {
        let type = '';

        // tslint:disable-next-line:radix
        value = parseInt(value);

        switch (value) {
            case 1 :
                type = 'Diputación';
                break;
            case 2 :
                type = 'Regidor';
                break;
            case 3 :
                type = 'Sindicatura';
                break;
            case 4 :
                type = 'Propietario';
                break;
            case 5 :
                type = 'Suplente';
                break;
            default :
                type = 'Not Defined';
        }
        return type;
    }
}
