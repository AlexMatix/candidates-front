import {Pipe, PipeTransform} from '@angular/core';
import {ALTERNATE, MORENA, MORENA_PT, OPERATOR, OWNER, PROMOTER, PSI, PT, VERDE} from '../util/Config.utils';

@Pipe({
    name: 'promoterPipe'
})
export class OperatorPipe implements PipeTransform {

    transform(value: number): string {
        let type = '';

        switch (value) {
            case 0 : type = 'Alta de administrador'; break;
            case MORENA : type = 'MORENA'; break;
            case PT : type = 'PT'; break;
            case VERDE : type = 'VERDE'; break;
            case PSI : type = 'PSI'; break;
            case MORENA_PT : type = 'MORENA/PT'; break;
            default : type = 'Not Defined';
        }

        return type;
    }

}
