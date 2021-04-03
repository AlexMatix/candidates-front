import {Component, OnInit} from '@angular/core';
import {messageErrorValidation} from '../../util/ValidatorsHelper';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PoliticalService} from '../../services/political.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    form: any;
    parties$: Observable<any>;
    excelTypes = [
        {id: 1, name: 'Diputados DRP'},
        {id: 2, name: 'Diputados DMR'},
        {id: 3, name: 'Diputados y Presidentes para INE'},
        {id: 4, name: 'Sindicaturas y Regidurias para INE'},
    ];

    constructor(
        private politicalService: PoliticalService
    ) {
        this.form = new FormGroup({
                party: new FormControl(null, Validators.required),
                type: new FormControl(null, Validators.required),
            }
        );

        this.parties$ = this.politicalService.getAll();
    }

    ngOnInit() {

    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }


    submit() {

    }
}
