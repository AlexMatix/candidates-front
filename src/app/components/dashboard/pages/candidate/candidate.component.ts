import {Component, OnInit} from '@angular/core';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidateService} from '../../../../services/candidate.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../util/Config.utils';
import {debounceTime, map} from 'rxjs/operators';
import {ActivatedRoute, Route, Router} from '@angular/router';

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
        {id: 4, name: 'Propietario'},
        {id: 5, name: 'Suplente'},
    ];

    id: number;
    editData: any;
    editForm = false;

    constructor(
        private _candidate: CandidateService,
        private router: ActivatedRoute,
        private _router: Router
    ) {
        this.form = new FormGroup({
                name: new FormControl('', [Validators.required]),
                patter_lastname: new FormControl('', [Validators.required]),
                mother_lastname: new FormControl('', [Validators.required]),
                nickname: new FormControl('', [ ]),
                birthplace: new FormControl('', [Validators.required]),
                date_birth: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                residence_time: new FormControl('', [Validators.required]),
                occupation: new FormControl('', [Validators.required]),
                elector_key: new FormControl('', [Validators.required], [this.keyElectorValidator.bind(this)]),
                electorKey_confirm: new FormControl('', [Validators.required]),
                postulate: new FormControl('', [Validators.required]),
                type_postulate: new FormControl('', [Validators.required]),
            },
            [
                ValidatorEquals('elector_key', 'electorKey_confirm', 'notEqualsElectorKey')
            ]
        );

        this.id = Number(this.router.snapshot.params.id);
        if (!isNaN(this.id) && this.id !== 0) {
            Swal.showLoading();
            this._candidate.getById(this.id).subscribe(
                response => {
                    console.log(response);
                    this.form.get('name').setValue(response.name);
                    this.form.get('patter_lastname').setValue(response.patter_lastname);
                    this.form.get('mother_lastname').setValue(response.mother_lastname);
                    this.form.get('nickname').setValue(response.nickname);
                    this.form.get('birthplace').setValue(response.birthplace);
                    this.form.get('date_birth').setValue(response.date_birth);
                    this.form.get('address').setValue(response.address);
                    this.form.get('residence_time').setValue(response.residence_time);
                    this.form.get('occupation').setValue(response.occupation);
                    this.form.get('elector_key').setValue(response.elector_key);
                    this.form.get('electorKey_confirm').setValue(response.elector_key);
                    this.form.get('postulate').setValue(response.postulate);
                    this.form.get('type_postulate').setValue(response.type_postulate);
                    this.editData = response;
                    this.editForm = true;
                    Swal.close();
                },
                error => {
                    MessagesUtil.errorMessage('Se presento un error al tratar de obtener los datos');
                }
            )
        }
    }

    ngOnInit() {
    }

    keyElectorValidator(control: AbstractControl) {
        return this._candidate.validateElectorKey(control.value, null).pipe(
            debounceTime(200),
            map(res => {
                return res.result === 'true' ? null : {keyElectorExist: true};
            })
        );
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

    cancel() {
        this.form.reset();
        if (this.editForm) {
            this._router.navigate(['/candidateList']);
        }
    }

    successSave() {
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.form.reset();
    }
}
