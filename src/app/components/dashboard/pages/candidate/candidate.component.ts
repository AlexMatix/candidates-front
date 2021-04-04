import {Component, Input, OnInit} from '@angular/core';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidateService} from '../../../../services/candidate.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, MORENA, PSI, PT, SAVE_MESSAGE, VERDE} from '../../../../util/Config.utils';
import {debounceTime, first, map} from 'rxjs/operators';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {MunicipalitiesService} from '../../../../services/municipalities.service';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';

@Component({
    selector: 'app-candidate',
    templateUrl: './candidate.component.html',
    styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
    type_candidate_form: FormGroup;
    form: FormGroup;
    alternateForm: FormGroup;
    district;
    data: any;

    type_postulate = [
        {id: 1, label: 'Diputación RP'},
        {id: 2, label: 'Diputación MR'},
    ]

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

    postulate = [
        {id: 1, name: 'Diputación'},
        {id: 2, name: 'Regidor'},
        {id: 3, name: 'Sindicatura'},
    ];

    type = [
        {id: 4, name: 'Propietario'},
        {id: 5, name: 'Suplente'},
    ];

    reelection = [
        {value: 1, label: 'Si'},
        {value: 0, label: 'No'}
    ]

    genders = [
        {value: 0, label: 'Hombre'},
        {value: 1, label: 'Mujer'}
    ]

    id: number;
    editData: any;
    editForm = false;

    party_color: string;
    municipalities$: Observable<any>;
    postulate_id;

    constructor(
        private location: Location,
        public municipalityService: MunicipalitiesService,
        private _candidate: CandidateService,
        private route: ActivatedRoute,
        private router: Router,
        private _municipalitiesService: MunicipalitiesService
    ) {
        this.municipalities$ = this._municipalitiesService.getAll();
        // this.form = new FormGroup({
        //         name: new FormControl('', [Validators.required]),
        //         father_lastname: new FormControl('', [Validators.required]),
        //         mother_lastname: new FormControl('', [Validators.required]),
        //         nickname: new FormControl('', [ ]),
        //         birthplace: new FormControl('', [Validators.required]),
        //         date_birth: new FormControl('', [Validators.required]),
        //         gender: new FormControl('', [Validators.required]),
        //         group_sexual_diversity: new FormControl('', [Validators.required]),
        //         indigenous_group: new FormControl('', [Validators.required]),
        //         disabled_group: new FormControl('', [Validators.required]),
        //         roads: new FormControl('', [Validators.required]),
        //         roads_name: new FormControl('', [Validators.required]),
        //         outdoor_number: new FormControl('', [Validators.required]),
        //         interior_number: new FormControl(''),
        //         neighborhood: new FormControl('', [Validators.required]),
        //         zipcode: new FormControl('', [Validators.required]),
        //         municipality: new FormControl('', [Validators.required]),
        //         entity: new FormControl('', [Validators.required]),
        //         section: new FormControl('', [Validators.required]),
        //         residence_time_year: new FormControl('', [Validators.required]),
        //         residence_time_month: new FormControl('', [Validators.required]),
        //         occupation: new FormControl('', [Validators.required]),
        //         elector_key: new FormControl('', [Validators.required], [this.keyElectorValidator.bind(this)]),
        //         electorKey_confirm: new FormControl('', [Validators.required]),
        //         ocr: new FormControl('', [Validators.required]),
        //         cic: new FormControl('', [Validators.required]),
        //         emission: new FormControl('', [Validators.required]),
        //         postulate: new FormControl('', [Validators.required]),
        //         re_election: new FormControl('', [Validators.required]),
        //         type_postulate: new FormControl('', [Validators.required]),
        //         number: new FormControl('', [Validators.required]),
        //         postulate_id: new FormControl('', [Validators.required]),
        //     },
        //     [
        //         ValidatorEquals('elector_key', 'electorKey_confirm', 'notEqualsElectorKey')
        //     ]
        // );

        this.type_candidate_form = new FormGroup({
                postulate: new FormControl('', [Validators.required]),
                // district: new FormControl('', [Validators.required]),
                // postulate_id: new FormControl('', [Validators.required]),
            }
        )

        this.type_candidate_form.get('postulate').valueChanges.subscribe(value => {
                if (value === 2) {
                    this.type_candidate_form.addControl('district', new FormControl('', [Validators.required]));
                    this.type_candidate_form.addControl('postulate_id', new FormControl('', [Validators.required]));
                }
                if (value === 1) {
                    if (this.type_candidate_form.controls['district']) {
                        this.type_candidate_form.removeControl('district');
                    }

                    if (this.type_candidate_form.controls['postulate_id']) {
                        this.type_candidate_form.removeControl('postulate_id');
                    }
                }
            }
        );

        this.municipalityService.getAll().pipe(
            first(),
        ).subscribe(
            value => {
                console.log(value);
                this.data = value;
            }
        );

        this.id = Number(this.route.snapshot.params.id);
        if (!isNaN(this.id) && this.id !== 0) {
            Swal.showLoading();
            this._candidate.getById(this.id).subscribe(
                response => {
                    console.log(response);
                    this.type_candidate_form.get('postulate').setValue(response.postulate);
                    // this.form.get('name').setValue(response.name);
                    // this.form.get('father_lastname').setValue(response.patter_lastname);
                    // this.form.get('mother_lastname').setValue(response.mother_lastname);
                    // this.form.get('nickname').setValue(response.nickname);
                    // this.form.get('birthplace').setValue(response.birthplace);
                    // this.form.get('date_birth').setValue(response.date_birth);
                    // this.form.get('address').setValue(response.address);
                    // this.form.get('residence_time').setValue(response.residence_time);
                    // this.form.get('occupation').setValue(response.occupation);
                    // this.form.get('elector_key').setValue(response.elector_key);
                    // this.form.get('electorKey_confirm').setValue(response.elector_key);
                    // this.form.get('postulate').setValue(response.postulate);
                    // this.form.get('type_postulate').setValue(response.type_postulate);
                    // this.editData = response;
                    // this.editForm = true;
                    Swal.close();
                },
                error => {
                    MessagesUtil.errorMessage('Se presento un error al tratar de obtener los datos');
                }
            )
        }
    }

    ngOnInit() {
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
                break;
            }
        }
    }

    onFormCandidateChangeEvent(_event) {
        this.form = _event;
    }

    onFormCandidateAlternateChangeEvent(_event) {
        this.alternateForm = _event;
    }

    keyElectorValidator(control: AbstractControl) {
        return this._candidate.validateElectorKey(control.value, null).pipe(
            debounceTime(200),
            map(res => {
                return res.result === 'true' ? null : {keyElectorExist: true};
            })
        );
    }

    submit() {
        const genderOwner = this.form.get('gender').value;
        const genderAlternate = this.alternateForm.get('gender').value;
        this.markFormGroupTouched(this.type_candidate_form);
        this.markFormGroupTouched(this.form);
        this.markFormGroupTouched(this.alternateForm);

        console.log(genderOwner);
        console.log(genderAlternate);

        if (this.type_candidate_form.invalid || this.form.invalid || this.alternateForm.invalid) {
            return;
        }

        if (genderOwner !== '' && genderAlternate !== '') {
            console.log('Generos vacios');
            if (genderOwner !== genderAlternate) {
                this.alternateForm.controls['gender'].setErrors({'equalGender': true})
            }
        }

        Swal.showLoading();
        if (this.type_candidate_form.get('postulate').value === 1) {
            this.type_candidate_form.removeControl('postulate_id');
            this.type_candidate_form.removeControl('district');
        }
        // const municipality = this.type_candidate_form.get('municipality').value.name;
        this.form.removeControl('id');
        this.alternateForm.removeControl('id');

        const data = {
            alternate: this.alternateForm.value,
            ...this.form.value,
            ...this.type_candidate_form.value
        };

        console.log(data);

        // this._candidate.add(data).subscribe(
        //     response => {
        //         this.successSave();
        //     },
        //     error => {
        //         console.log(error);
        //         MessagesUtil.errorMessage(ERROR_MESSAGE);
        //     }
        // );
    }

    cancel() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        this.type_candidate_form.reset();
    }

    successSave() {
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.type_candidate_form.reset();
        this.alternateForm.reset();
        this.form.reset();
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    };

    changeDistritct(value) {
        this.district = value;
    }

    // changeMunicipalitie(value) {
    //     console.log(value);
    //     this.postulate_id = value.id;
    // }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }


}
