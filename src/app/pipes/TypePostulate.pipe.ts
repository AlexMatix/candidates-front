import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
    name: 'ironmanPipe'
})
export class IronmanPipe implements PipeTransform {

    transform(value: any): string {
        let string = 'Vacio';
        if (value !== null) {
            string = value.name + ' ' + value.fatherLastName + ' ' + value.motherLastName;
        }
        return string;
    }

}
