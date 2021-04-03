import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, MORENA, PSI, PT, SAVE_MESSAGE, VERDE} from '../../../../util/Config.utils';
import {CandidateService} from '../../../../services/candidate.service';
import {Router} from '@angular/router';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';

@Component({
    selector: 'app-candidate-ine',
    templateUrl: './candidate-ine.component.html',
    styleUrls: ['./candidate-ine.component.scss']
})
export class CandidateIneComponent implements OnInit {

    @Output()
    onFormCandidateChange = new EventEmitter<any>();

    form: FormGroup;
    formAlternate: FormGroup;
    editForm = false;

    roads = [
        {id: 1, name: 'Ampliación'},
        {id: 2, name: 'Andador'},
        {id: 3, name: 'Avenida'},
        {id: 4, name: 'Boulevard'},
        {id: 5, name: 'Calle'},
        {id: 6, name: 'Callejon'},
        {id: 7, name: 'Calzada'},
        {id: 8, name: 'Cerrada'},
        {id: 9, name: 'Circuito'},
        {id: 10, name: 'Circulación'},
        {id: 11, name: 'Continuación'},
        {id: 12, name: 'Corredor'},
        {id: 13, name: 'Diagonal'},
        {id: 14, name: 'Eje vial'},
        {id: 15, name: 'Pasaje'},
        {id: 16, name: 'Peatonal'},
        {id: 17, name: 'Periférico'},
        {id: 18, name: 'Privada'},
        {id: 19, name: 'Prolongación'},
        {id: 20, name: 'Retorno'},
        {id: 21, name: 'Viaducto'},
    ]

    phone_type = [
        {value: 1, name: 'Casa'},
        {value: 2, name: 'Celular'},
        {value: 3, name: 'Trabajo'},
        {value: 4, name: 'Partido Político'},
    ];

    type = [
        {id: 4, name: 'Propietario'},
        {id: 5, name: 'Suplente'},
    ];

    campaigns = [
        {value: 1, name: 'Si'},
        {value: 0, name: 'No'}
    ]

    genders = [
        {value: 0, label: 'Hombre'},
        {value: 1, label: 'Mujer'}
    ]


    party_color: string;

    constructor(
        private _candidate: CandidateService,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
                number_line: new FormControl('', [Validators.required]),
                circumscription: new FormControl(''),
                locality: new FormControl(''),
                demarcation: new FormControl('', [Validators.required]),
                municipalities_council: new FormControl(''),
                campaign_slogan: new FormControl(''),
                list_number: new FormControl(''),
                campaign: new FormControl('', [Validators.required]),
                curp: new FormControl('', [Validators.required]),
                curp_confirmation: new FormControl('', [Validators.required]),
                rfc: new FormControl('', [Validators.required]),
                phone_type: new FormControl('', [Validators.required]),
                lada: new FormControl(''),
                phone: new FormControl('', [Validators.required]),
                extension: new FormControl(''),
                email: new FormControl('', [Validators.required]),
                email_confirmation: new FormControl('', [Validators.required, Validators.email]),
                total_annual_income: new FormControl('', [Validators.required, Validators.email]),
                salary_annual_income: new FormControl(''),
                financial_performances: new FormControl(''),
                annual_profit_professional_activity: new FormControl(''),
                annual_real_estate_lease_earnings: new FormControl(''),
                professional_services_fees: new FormControl(''),
                other_income: new FormControl(''),
                total_annual_expenses: new FormControl('', [Validators.required]),
                personal_expenses: new FormControl('', [Validators.required]),
                real_estate_payments: new FormControl(''),
                debt_payments: new FormControl(''),
                loss_personal_activity: new FormControl(''),
                other_expenses: new FormControl(''),
                property: new FormControl(''),
                vehicles: new FormControl(''),
                other_movable_property: new FormControl(''),
                bank_accounts: new FormControl(''),
                other_assets: new FormControl(''),
                payment_debt_amount: new FormControl(''),
                other_passives: new FormControl(''),
            }
        );

        const user = JSON.parse(localStorage.getItem('user'));
        switch (user.politic_party_id) {
            case MORENA: {
                this.party_color = 'morena'
                break;
            }
            case PT: {
                this.party_color = 'pt'
                break;
            }
            case VERDE: {
                this.party_color = 'verde'
                break;
            }
            case PSI: {
                this.party_color = 'psi'
                break;
            }
            default: {
                this.party_color = 'morena'
            }
        }
    }

    onFormCandidateChangeEvent(_event) {
        console.log(_event);
        this.form = _event;
        // console.error(_event, this.form['controls']);
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

    cancel() {
        this.form.reset();
        if (this.editForm) {
            this._router.navigate(['/candidateList']);
        }
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    };


}
