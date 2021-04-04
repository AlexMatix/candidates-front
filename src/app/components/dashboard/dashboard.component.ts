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
        {id: 1, name: 'Diputados DRP', report: 1},
        {id: 2, name: 'Diputados DMR', report: 2},
        {id: 3, name: 'Ayuntamiento', report: 3},
        {id: 4, name: 'Diputados y Presidentes para INE', report: 1},
        {id: 5, name: 'Sindicaturas y Regidurias para INE', report: 2},
    ];

    constructor(
        private politicalService: PoliticalService
    ) {
        this.form = new FormGroup({
                party: new FormControl(null),
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

