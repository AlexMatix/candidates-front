import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {
    COMPROMISO_POR_PUEBLA,
    ERROR_MESSAGE,
    MORENA,
    NUEVA_ALIANZA,
    PSI,
    PT,
    REDES_SOCIALES_PROGRESISTAS,
    SAVE_MESSAGE,
    VERDE
} from '../../../../util/Config.utils';
import {CandidateService} from '../../../../services/candidate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {Location} from '@angular/common';

@Component({
    selector: 'app-candidate-ine',
    templateUrl: './candidate-ine.component.html',
    styleUrls: ['./candidate-ine.component.scss']
})
export class CandidateIneComponent implements OnInit {

    @Output()
    onFormCandidateChange = new EventEmitter<any>();

    form: FormGroup;
    editForm = false;
    candidateData;

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
    type_postulate;
    subscription;
    origin_candidate_id;

    isEdit = false;

    private CURP_REGEX: '/^([A-Z][AEIOUX][A-Z]{2}\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\\d])(\\d)$/';

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private _candidate: CandidateService
    ) {
        this.origin_candidate_id = Number(this.route.snapshot.params.id);
    }

    ngOnInit(): void {

        this._candidate.getById(this.origin_candidate_id).subscribe(data => {
                this.candidateData = data;
                console.log(this.candidateData);
            }
        )


        this.subscription = this.route
            .queryParams
            .subscribe(params => {
                this.type_postulate = +params['type'];
                if (this.type_postulate === 1) {
                    this.createOwnerForm();
                    this._candidate.getIne(this.origin_candidate_id).subscribe(data => {
                        if (data) {
                            Swal.showLoading();
                            console.log('Hay data =>', data);
                            this.isEdit = true;
                            this.form.patchValue(data);
                            Swal.close();
                        }
                    });
                }
                if (this.type_postulate === 2) {
                    this.createAlternateForm();
                    this._candidate.getIne(this.origin_candidate_id).subscribe(data => {
                        if (data) {
                            Swal.showLoading();
                            console.log('Hay data =>', data);
                            this.isEdit = true;
                            this.form.patchValue(data);
                            Swal.close();
                        }
                    });
                }
            });

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
                this.party_color = 'morena'
            }
        }
    }

    createOwnerForm() {
        this.form = new FormGroup({
                number_line: new FormControl('',
                    Validators.compose(
                        [
                            Validators.required,
                            Validators.minLength(1),
                            Validators.maxLength(3)
                        ]
                    )
                ),
                number_list: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]),
                circumscription: new FormControl(''),
                locality: new FormControl(''),
                demarcation: new FormControl('',
                    Validators.compose(
                        [
                            Validators.minLength(1),
                            Validators.maxLength(3)
                        ])),
                municipalities_council: new FormControl(''),
                campaign_slogan: new FormControl(''),
                list_number: new FormControl(''),
                campaign: new FormControl('', [Validators.required]),
                curp: new FormControl('',
                    Validators.compose(
                        [
                            Validators.required,
                            Validators.minLength(18),
                            Validators.pattern(this.CURP_REGEX)
                        ]
                    )),
                curp_confirmation: new FormControl('',
                    Validators.compose(
                        [
                            Validators.required,
                            Validators.minLength(18),
                            Validators.pattern(this.CURP_REGEX)
                        ]
                    ),
                ),
                rfc: new FormControl('', Validators.compose(
                    [
                        Validators.required,
                        Validators.minLength(13)
                    ]
                )),
                phone_type: new FormControl('', [Validators.required]),
                lada: new FormControl(''),
                phone: new FormControl('', Validators.compose(
                    [
                        Validators.required,
                        Validators.minLength(7),
                        Validators.maxLength(10),
                    ]
                )),
                extension: new FormControl(''),
                email: new FormControl('', [Validators.required, Validators.email]),
                email_confirmation: new FormControl('', [Validators.required, Validators.email]),
                total_annual_income: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                salary_annual_income: new FormControl(''),
                financial_performances: new FormControl(''),
                annual_profit_professional_activity: new FormControl(''),
                annual_real_estate_lease_earnings: new FormControl(''),
                professional_services_fees: new FormControl(''),
                other_income: new FormControl(''),
                total_annual_expenses: new FormControl('', [Validators.required]),
                personal_expenses: new FormControl(''),
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
            },
            [
                ValidatorEquals('curp', 'curp_confirmation', 'notEqualsCurp'),
                ValidatorEquals('email', 'email_confirmation', 'notEqualsEmail')
            ]
        );
    }

    createAlternateForm() {
        this.form = new FormGroup({
                curp: new FormControl('',
                    Validators.compose(
                        [
                            Validators.required,
                            Validators.minLength(18),
                            Validators.pattern(this.CURP_REGEX)
                        ]
                    )),
                curp_confirmation: new FormControl('',
                    Validators.compose(
                        [
                            Validators.required,
                            Validators.minLength(18),
                            Validators.pattern(this.CURP_REGEX)
                        ]
                    ),
                ),
                rfc: new FormControl('', Validators.compose(
                    [
                        Validators.required,
                        Validators.minLength(13)
                    ]
                )),
                phone_type: new FormControl('', [Validators.required]),
                lada: new FormControl(''),
                phone: new FormControl('', Validators.compose(
                    [
                        Validators.required,
                        Validators.minLength(7),
                        Validators.maxLength(10),
                    ]
                )),
                extension: new FormControl(''),
                email: new FormControl('', [Validators.required, Validators.email]),
                email_confirmation: new FormControl('', [Validators.required, Validators.email]),
                others: new FormControl(''),
                considerations: new FormControl(''),
            },
            [
                ValidatorEquals('curp', 'curp_confirmation', 'notEqualsCurp'),
                ValidatorEquals('email', 'email_confirmation', 'notEqualsEmail')
            ]);
    }

    onFormCandidateChangeEvent(_event) {
        console.log(_event);
        this.form = _event;
        // console.error(_event, this.form['controls']);
    }

    submit() {
        Swal.showLoading();
        const body = {
            ...this.candidateData,
            ...this.form.value,
            origin_candidate_id: this.origin_candidate_id
        }

        if (this.isEdit) {
            this._candidate.updateIne(body, this.origin_candidate_id).subscribe(
                response => {
                    console.log(response);
                    this.successSave();
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        } else {
            this._candidate.addIne(body).subscribe(
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
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.location.back();
        this.form.reset();
    }

    cancel() {
        this.location.back();
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    };

    onPressCURP(value) {
        const length = this.form.get('curp').value.length + 1;
        if (length > 18) {
            return false;
        }

        if ((length > 4 && length < 11) || length > 16) {
            if (value.charCode >= 48 && value.charCode <= 57) {
                return true;
            }
        }
        if ((length >= 1 && length <= 4) || (length >= 11 && length <= 16) || (length > 16)) {
            if ((value.charCode >= 65 && value.charCode <= 90) || (value.charCode >= 97 && value.charCode <= 122)) {
                return true;
            }
        }
        return false;
    }

    onPressCURPConfirmation(value) {
        const length = this.form.get('curp_confirmation').value.length + 1;
        if (length > 18) {
            return false;
        }

        if ((length > 4 && length < 11) || length > 16) {
            if (value.charCode >= 48 && value.charCode <= 57) {
                return true;
            }
        }
        if ((length >= 1 && length <= 4) || (length >= 11 && length <= 16) || (length > 16)) {
            if ((value.charCode >= 65 && value.charCode <= 90) || (value.charCode >= 97 && value.charCode <= 122)) {
                return true;
            }
        }
        return false;
    }


}
