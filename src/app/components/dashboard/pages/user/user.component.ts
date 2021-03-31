import {Component, OnInit, ViewChild} from '@angular/core';
import {UserDataTableComponent} from './user-data-table/user-data-table.component';
import {PoliticalPartiesModel} from '../../../../models/politicalParties.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {UserService} from '../../../../services/user.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../util/Config.utils';
import {UserModel} from '../../../../models/user.model';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    panelOpenState = false;
    editForm = false;
    dataEditForm: any;
    @ViewChild(UserDataTableComponent, {static: false})
    dataTable: UserDataTableComponent;
    form: FormGroup;
    alertEdit = false;
    roles: any = [
        {id: 1, name: 'Administrador'},
        {id: 2, name: 'Capturista'},
    ];

    parties: any = [
        {id: 1, name: 'MORENA'},
        {id: 2, name: 'PRI'},
        {id: 3, name: 'PAN'},
    ];

    constructor(private _user: UserService) {
        this.form = new FormGroup({
                name: new FormControl('', [Validators.required]),
                email: new FormControl('', [Validators.required, Validators.email]),
                type: new FormControl('', [Validators.required]),
                party: new FormControl('', [Validators.required]),
                password: new FormControl('', [Validators.required, Validators.minLength(6)]),
                password_confirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
            },
            [
                ValidatorEquals('password', 'password_confirm', 'notEqualsPassword'),
            ]
        );
    }

    ngOnInit() {
    }

    submit() {
        Swal.showLoading();
        if (this.editForm) {
            let data = this.form.value;
            delete data.password_confirm;
            this._user.edit(data, this.dataEditForm.id).subscribe(
                response => {
                    this.successSave();
                    this.form.get('password').setValidators([Validators.required, Validators.minLength(6)]);
                    this.form.get('password').updateValueAndValidity();
                    this.form.get('password_confirm').setValidators([Validators.required, Validators.minLength(6)]);
                    this.form.get('password_confirm').updateValueAndValidity();
                    this.editForm = false;
                    this.dataEditForm = null;
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        } else {
            let editP = false;
            let deleteP = false;
            if (this.form.get('type').value === 1) {
                editP = true;
                deleteP = true;
            }
            let data = this.form.value;
            data.configuration = {
                permission: {
                    edit: editP,
                    delete: deleteP,
                }
            };

            this._user.add(data).subscribe(
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
    }

    successSave() {
        this.dataTable.setDataSource(false);
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.editForm = false;
        this.form.reset();
        this.panelOpenState = false;
        this.alertEdit = false;
    }

    setStatusOpenState(status: boolean) {
        if (!status) {
            this.form.reset();
            this.editForm = false;
            this.alertEdit = false;
        }
    }

    editUser(data: UserModel) {
        this.form.get('name').setValue(data.name);
        this.form.get('email').setValue(data.email);
        this.form.get('type').setValue(data.type);
        this.alertEdit = true;
        this.panelOpenState = true;
        this.editForm = true;
        this.dataEditForm = data;
        this.form.get('password').clearValidators();
        this.form.get('password').updateValueAndValidity();

        this.form.get('password_confirm').clearValidators();
        this.form.get('password_confirm').updateValueAndValidity();
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

}
