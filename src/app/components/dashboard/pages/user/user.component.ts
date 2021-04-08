import {Component, OnInit, ViewChild} from '@angular/core';
import {UserDataTableComponent} from './user-data-table/user-data-table.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {UserService} from '../../../../services/user.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {
    COMPROMISO_POR_PUEBLA,
    ERROR_MESSAGE,
    MORENA,
    MORENA_PT,
    NUEVA_ALIANZA,
    PSI,
    PT,
    REDES_SOCIALES_PROGRESISTAS,
    SAVE_MESSAGE,
    VERDE
} from '../../../../util/Config.utils';
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
    @ViewChild(UserDataTableComponent)
    dataTable: UserDataTableComponent;
    form: FormGroup;
    alertEdit = false;
    roles: any = [
        {id: 1, name: 'Administrador'},
        {id: 2, name: 'Capturista'},
    ];

    parties: any = [
        {id: MORENA, name: 'MORENA'},
        {id: PT, name: 'PT'},
        {id: VERDE, name: 'VERDE'},
        {id: PSI, name: 'PSI'},
        {id: MORENA_PT, name: 'MORENA/PT'},
        {id: NUEVA_ALIANZA, name: 'NUEVA ALIANZA'},
        {id: COMPROMISO_POR_PUEBLA, name: 'COMPROMISO POR PUEBLA'},
        {id: REDES_SOCIALES_PROGRESISTAS, name: 'REDES SOCIALES PROGRESISTAS'}
    ];

    party_color: string;

    constructor(private _user: UserService) {
        this.form = new FormGroup({
                name: new FormControl('', [Validators.required]),
                email: new FormControl('', [Validators.required, Validators.email]),
                type: new FormControl('', [Validators.required]),
                politic_party_id: new FormControl('', [Validators.required]),
                password: new FormControl('', [Validators.required, Validators.minLength(6)]),
                password_confirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
            },
            [
                ValidatorEquals('password', 'password_confirm', 'notEqualsPassword'),
            ]
        );
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('user'));
        switch (user.politic_party_id) {
            case MORENA: {
                this.party_color = 'morena';
                break;
            }
            case PT: {
                this.party_color = 'pt';
                break;
            }
            case VERDE: {
                this.party_color = 'verde';
                break;
            }
            case PSI: {
                this.party_color = 'psi';
                break;
            }
            case NUEVA_ALIANZA: {
                this.party_color = 'nueva-alianza'
                break;
            }

            case COMPROMISO_POR_PUEBLA: {
                this.party_color = 'compromiso'
                break;
            }

            case REDES_SOCIALES_PROGRESISTAS: {
                this.party_color = 'redes-sociales'
                break;
            }
            default: {
                this.party_color = 'morena';
                break;
            }
        }
    }

    submit() {
        Swal.showLoading();
        if (this.editForm) {
            const data = this.form.value;
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
            const data = this.form.value;

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
        this.form.get('politic_party_id').setValue(data.party);
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
