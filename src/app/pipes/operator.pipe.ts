import {Pipe, PipeTransform} from '@angular/core';
import {ALTERNATE, OPERATOR, OWNER, PROMOTER} from '../util/Config.utils';

@Pipe({
    name: 'promoterPipe'
})
export class OperatorPipe implements PipeTransform {

    transform(value: number): string {
        let type = '';

        switch (value) {
            case 0 : type = 'Alta de administrador'; break;
            case 1 : type = 'MORENA'; break;
            case 2 : type = 'PRI'; break;
            case 3 : type = 'PAN'; break;
            default : type = 'Not Defined';
        }

        return type;
    }

}
