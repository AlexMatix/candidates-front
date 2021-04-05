import {Component, OnInit} from '@angular/core';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidateService} from '../../../../services/candidate.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, MORENA, PSI, PT, SAVE_MESSAGE, VERDE} from '../../../../util/Config.utils';
import {debounceTime, first, map, scan, takeWhile, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {MunicipalitiesService} from '../../../../services/municipalities.service';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';
import {interval as observableInterval} from 'rxjs';


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
        // this.createCandidateForm();

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
                    this.type_candidate_form.get('district').valueChanges.subscribe(district => {
                        this.district = district;
                    })
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
                this.data = value;
            }
        );
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
        this.id = Number(this.route.snapshot.params.id);
        if (!isNaN(this.id) && this.id !== 0) {
            Swal.showLoading();
            this._candidate.getById(this.id).subscribe(
                response => {
                    this.editForm = true;
                    console.log(response);
                    this.type_candidate_form.get('postulate').setValue(response.postulate);
                    if (response.postulate === 2) {
                        this.type_candidate_form.get('district').setValue(response.postulate_data.district);
                        this.type_candidate_form.get('district').updateValueAndValidity();
                        this.type_candidate_form.get('postulate_id').setValue(response.postulate_id);
                    }
                    this.setCandidateData(this.form, response);
                    this.setCandidateData(this.alternateForm, response.alternate);
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
                    Swal.close();
                },
                error => {
                    MessagesUtil.errorMessage('Se presento un error al tratar de obtener los datos');
                }
            )
        }
    }

    onFormCandidateChangeEvent(form: FormGroup) {
        this.form = form;
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

        if (this.type_candidate_form.invalid) {
            return;
        }
        if (this.alternateForm.invalid) {
            return;
        }
        if (this.form.invalid) {
            return;
        }

        if (genderOwner !== '' && genderAlternate !== '') {
            console.log('Generos vacios');
            if (genderOwner !== genderAlternate) {
                this.alternateForm.controls['gender'].setErrors({'equalGender': true})
            }
        }

        if (this.type_candidate_form.get('postulate').value === 1) {
            this.type_candidate_form.removeControl('postulate_id');
            this.type_candidate_form.removeControl('district');
        }
        // const municipality = this.type_candidate_form.get('municipality').value.name;
        if (!this.editForm) {
            this.form.removeControl('id');
            this.alternateForm.removeControl('id');
        }

        const data = {
            alternate: this.alternateForm.value,
            ...this.form.value,
            ...this.type_candidate_form.value
        };

        Swal.showLoading();

        if (this.editForm) {
            this._candidate.edit(data, this.id).subscribe(response => {
                this.successSave();
                console.log(response);
            }, error => {
                console.error(error);
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            })
        } else {
            this._candidate.add(data).subscribe(
                response => {
                    this.successSave();
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        }
    }

    cancel(el) {
        const duration = 600;
        const interval = 5;
        const move = el.scrollTop * interval / duration;
        observableInterval(interval).pipe(
            scan((acc, curr) => acc - move, el.scrollTop),
            tap(position => el.scrollTop = position),
            takeWhile(val => val > 0)).subscribe();
        this.type_candidate_form.reset();
        this.form.reset();
        this.alternateForm.reset();
    }

    successSave() {
        if (this.editForm) {
            this.location.back();
        }
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

    private scrollTContentToTop(): void {

        document.querySelector('main').scrollTo(0, 0);

    }


    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    protected setCandidateData(formGroup: FormGroup, candidate: any) {
        const keys = ['id',
            'name',
            'father_lastname',
            'mother_lastname',
            'nickname',
            'birthplace',
            'date_birth',
            'gender',
            'group_sexual_diversity',
            'indigenous_group',
            'disabled_group',
            'roads_name',
            'outdoor_number',
            'interior_number',
            'neighborhood',
            'zipcode',
            'municipality',
            'entity',
            'section',
            'residence_time_year',
            'residence_time_month',
            'occupation',
            'elector_key',
            'ocr',
            'cic',
            'emission',
            're_election',
            'type_postulate'];

        for (const key of keys) {
            formGroup.get(key).setValue(candidate[key]);
        }
        formGroup.get('electorKey_confirm').setValue(candidate['elector_key']);
        // tslint:disable-next-line:radix
        formGroup.get('roads').setValue(parseInt(candidate['roads'] ?? 0));
    }


}
