import {Component, OnInit, Output, EventEmitter} from '@angular/core';
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
export class CandidateFormComponent implements OnInit {

    form: FormGroup;

    municipalities$: Observable<any>;

    @Output()
    onFormCandidateChange = new EventEmitter<any>();

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


    constructor(
        private _candidate: CandidateService,
        private _municipalitiesService: MunicipalitiesService
    ) {
        this.municipalities$ = this._municipalitiesService.getAll();

    }

    ngOnInit(): void {
        this.form = new FormGroup({
                name: new FormControl('', [Validators.required]),
                father_lastname: new FormControl('', [Validators.required]),
                mother_lastname: new FormControl('', [Validators.required]),
                nickname: new FormControl('', [ ]),
                birthplace: new FormControl('', [Validators.required]),
                date_birth: new FormControl('', [Validators.required]),
                gender: new FormControl('', [Validators.required]),
                group_sexual_diversity: new FormControl('', [Validators.required]),
                indigenous_group: new FormControl('', [Validators.required]),
                disabled_group: new FormControl('', [Validators.required]),
                roads: new FormControl('', [Validators.required]),
                roads_name: new FormControl('', [Validators.required]),
                outdoor_number: new FormControl('', [Validators.required]),
                interior_number: new FormControl(''),
                neighborhood: new FormControl('', [Validators.required]),
                zipcode: new FormControl('', [Validators.required]),
                municipality: new FormControl('', [Validators.required]),
                entity: new FormControl('', [Validators.required]),
                section: new FormControl('', [Validators.required]),
                residence_time_year: new FormControl('', [Validators.required]),
                residence_time_month: new FormControl('', [Validators.required]),
                occupation: new FormControl('', [Validators.required]),
                elector_key: new FormControl('', [Validators.required], [this.keyElectorValidator.bind(this)]),
                electorKey_confirm: new FormControl('', [Validators.required]),
                ocr: new FormControl('', [Validators.required]),
                cic: new FormControl('', [Validators.required]),
                emission: new FormControl('', [Validators.required]),
                postulate: new FormControl('', [Validators.required]),
                re_election: new FormControl('', [Validators.required]),
                type_postulate: new FormControl('', [Validators.required]),
                number: new FormControl('', [Validators.required]),
                postulate_id: new FormControl('', [Validators.required]),
            },
            [
                ValidatorEquals('elector_key', 'electorKey_confirm', 'notEqualsElectorKey')
            ]
        );
        this.onFormCandidateChange.emit(this.form);
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    };

    keyElectorValidator(control: AbstractControl) {
        return this._candidate.validateElectorKey(control.value, null).pipe(
            debounceTime(200),
            map(res => {
                return res.result === 'true' ? null : {keyElectorExist: true};
            })
        );
    }


}
