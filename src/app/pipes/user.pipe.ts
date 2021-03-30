import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
    name: 'userPipe'
})
export class UserPipe implements PipeTransform {

    transform(value: number): string {
        let userType = 'Capturista';

        if (value === 1) {
            userType = 'Administrador';
        }

        return userType;
    }

}
