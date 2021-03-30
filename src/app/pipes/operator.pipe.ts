import {Pipe, PipeTransform} from '@angular/core';
import {ALTERNATE, OPERATOR, OWNER, PROMOTER} from '../util/Config.utils';

@Pipe({
    name: 'promoterPipe'
})
export class OperatorPipe implements PipeTransform {

    transform(value: number): string {
        let type = '';

        switch (value) {
            case OPERATOR : type = 'Operador'; break;
            case OWNER : type = 'Propietario'; break;
            case ALTERNATE : type = 'Suplente'; break;
            case PROMOTER : type = 'Promotor'; break;
            default : type = 'Not Defined';
        }

        return type;
    }

}
