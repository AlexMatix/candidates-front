import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
    name: 'typePostulate'
})
export class TypePostulatePipe implements PipeTransform {

    transform(value: any): string {
        let type = '';

        switch (value) {
            case 1 :
                type = 'Propietario';
                break;
            case 2 :
                type = 'Suplente';
                break;
            default :
                type = 'Not Defined';
        }

        return type;
    }

}
