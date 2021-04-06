import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {debounceTime, map} from 'rxjs/operators';
import {CandidateService} from '../../../../services/candidate.service';
import {Observable} from 'rxjs';
import {MunicipalitiesService} from '../../../../services/municipalities.service';

@Component({
    selector: 'app-candidate-form',
    templateUrl: './candidate-form.component.html',
    styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent implements OnInit, OnChanges {

    form: FormGroup;

    @Input()
    isRequired = true;

    @Input()
    gender: string

    municipalities$: Observable<any>;

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
        {id: 22, name: 'Localidad'},
        {id: 23, name: 'Carretera'},
        {id: 24, name: 'Plaza'},
        {id: 25, name: 'Camino'},
        {id: 26, name: 'Sección'}
    ]

    @Output()
    onFormCandidateChange = new EventEmitter<any>();

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
        {value: 'SI', label: 'Si'},
        {value: 'NO', label: 'No'}
    ]

    genders = [
        {value: 'HOMBRE', label: 'Hombre'},
        {value: 'MUJER', label: 'Mujer'}
    ]


    constructor(
        private _candidate: CandidateService,
        private _municipalitiesService: MunicipalitiesService
    ) {
        this.municipalities$ = this._municipalitiesService.getAll();

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setGenderValue()
    }

    ngOnInit(): void {
        this.form = new FormGroup({
                id: new FormControl(0),
                name: new FormControl('', []),
                father_lastname: new FormControl('', []),
                mother_lastname: new FormControl('', []),
                nickname: new FormControl('', []),
                birthplace: new FormControl('', []),
                date_birth: new FormControl('', []),
                gender: new FormControl('', []),
                group_sexual_diversity: new FormControl('', []),
                indigenous_group: new FormControl('', []),
                disabled_group: new FormControl('', []),
                roads: new FormControl('', []),
                roads_name: new FormControl('', []),
                outdoor_number: new FormControl('', []),
                interior_number: new FormControl(''),
                neighborhood: new FormControl('', []),
                zipcode: new FormControl('', []),
                municipality: new FormControl('', []),
                entity: new FormControl('', []),
                section: new FormControl('', []),
                residence_time_year: new FormControl('', [Validators.min(5)]),
                residence_time_month: new FormControl('', []),
                occupation: new FormControl('', []),
                elector_key: new FormControl('', [], [this.keyElectorValidator.bind(this)]),
                electorKey_confirm: new FormControl('', []),
                ocr: new FormControl('', [], []),
                cic: new FormControl('', []),
                emission: new FormControl('', []),
                user_id: new FormControl('', []),
                // postulate: new FormControl('', []),
                re_election: new FormControl('', []),
                type_postulate: new FormControl(this.isRequired ? 1 : 2, []), // define is if owner or alternate
                // number: new FormControl('', []),
                // postulate_id: new FormControl('', []),
            },
            [
                ValidatorEquals('elector_key', 'electorKey_confirm', 'notEqualsElectorKey')
            ]
        );
        this.setGenderValue();
        this.setEnabledGender();
        this.setRequiredFields();
        this.onFormCandidateChange.emit(this.form);
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    };

    keyElectorValidator(control: AbstractControl) {
        return this._candidate.validateElectorKey(control.value, this.form?.get('id')?.value ?? 0).pipe(
            debounceTime(200),
            map(res => {
                return res.result === 'true' ? null : {keyElectorExist: true};
            })
        );
    }

    ocrValidator(control: AbstractControl) {
        return this._candidate.validateOCR(control.value, this.form?.get('id')?.value ?? 0).pipe(
            debounceTime(200),
            map(res => {
                return res === 'true' ? null : {ocrExist: true};
            })
        );
    }

    private setRequiredFields() {
        if (this.isRequired) {
            for (const key in this.form.controls) {
                if (key === 'user_id') {
                    continue; // omit this
                }
                if (key === 'nickname') {
                    continue; // omit this
                }
                if (key === 'interior_number') {
                    continue; // omit this
                }
                if (key === 'cic') {
                    continue; // omit this
                }
                if (key === 'residence_time_month') {
                    continue; // omit this
                }
                if (key === 'residence_time_year') {
                    this.form.get('residence_time_year').setValidators([Validators.required, Validators.min(5)]);
                    continue; // omit this
                }
                this.form.get(key).setValidators(Validators.required);
            }
        }
    }

    private setEnabledGender() {
        if (typeof this.gender !== 'undefined') {
            this.form.get('gender').disable();
        }
    }

    private setGenderValue() {
        if (this.gender) {
            this.form.get('gender').setValue(this.gender);
        }
    }

}
