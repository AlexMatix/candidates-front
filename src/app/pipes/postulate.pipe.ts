import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'postulatePipe'
})

export class PostulatePipe implements PipeTransform {

    transform(value: number): any {
        let type = '';

        // tslint:disable-next-line:radix
        // value = parseInt(value);

        switch (value) {
            case 1 :
                type = 'Diputación DRP';
                break;
            case 2 :
                type = 'Diputación DMR';
                break;
            case 3 :
                type = 'Regiduria';
                break;
            case 4 :
                type = 'Sindicatura';
                break;
            case 5 :
                type = 'Presidencia';
                break;
            default :
                type = 'Not Defined';
        }

        return type;
    }
}
