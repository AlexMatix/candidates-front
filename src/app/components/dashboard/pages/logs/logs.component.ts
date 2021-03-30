import {Component, OnInit} from '@angular/core';
import {ADMIN} from '../../../../util/Config.utils';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    isPermission() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user.type === ADMIN;
    }
}
