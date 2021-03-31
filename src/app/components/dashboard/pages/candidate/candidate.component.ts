import {Component, OnInit} from '@angular/core';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidateService} from '../../../../services/candidate.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../util/Config.utils';

@Component({
    selector: 'app-candidate',
    templateUrl: './candidate.component.html',
    styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {

    form: FormGroup;

    postulate = [
        {id: 1, name: 'Diputación'},
        {id: 2, name: 'Regidor'},
        {id: 3, name: 'Sindicatura'},
    ];

    type = [
        {id: 1, name: 'Propietario'},
        {id: 2, name: 'Suplente'},
    ];


    constructor(
        private _candidate: CandidateService
    ) {
        this.form = new FormGroup({
            name: new FormControl('', []),
            patter_lastname: new FormControl('', []),
            mother_lastname: new FormControl('', []),
            nickname: new FormControl('', []),
            birthplace: new FormControl('', []),
            date_birth: new FormControl('', []),
            address: new FormControl('', []),
            residence_time: new FormControl('', []),
            occupation: new FormControl('', []),
            elector_key: new FormControl('', []),
            electorKey_confirm: new FormControl('', []),
            postulate: new FormControl('', []),
            type_postulate: new FormControl('', []),
        });
    }

    ngOnInit() {
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    submit() {
        Swal.showLoading();
        this._candidate.add(this.form.value).subscribe(
            response => {
                console.log(response);
                this.successSave();
            },
            error => {
                console.log(error);
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            }
        );
    }

    successSave() {
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.form.reset();
    }
}
