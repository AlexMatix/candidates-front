import {Component, OnInit} from '@angular/core';
import {MORENA, PSI, PT, VERDE} from '../../../../util/Config.utils';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MunicipalitiesService} from '../../../../services/municipalities.service';
import {first} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-city-hall',
    templateUrl: './city-hall.component.html',
    styleUrls: ['./city-hall.component.scss']
})
export class CityHallComponent implements OnInit {
    party_color: string;
    form: FormGroup;
    charges = [
        {id: 'presidency', value: 'Presidente', chargeId: 5},
        {id: 'regidurias', value: 'Regidor', chargeId: 3},
        {id: 'sindicaturas', value: 'Sindical', chargeId: 4},
    ];

    candidatesFormArray = new FormArray([]);
    data: any;
    district = '0';
    sizeStepper = 0;
    ownerFormArray: FormGroup[] = [];
    private alternateFormArray: FormGroup[] = [];
    controlsArray = [];

    static printErrors(form: FormGroup) {
        // tslint:disable-next-line:forin
        for (const key in form.controls) {
            const abstractControl = form.get(key);
            console.log(key, abstractControl.errors);
        }
    }

    constructor(
        public municipalityService: MunicipalitiesService,
    ) {
        this.form = new FormGroup({
                district: new FormControl(null, Validators.required),
                postulate_id: new FormControl(null, Validators.required),
                postulate: new FormControl(null, Validators.required),
                candidates: this.candidatesFormArray,
            },
            [this.validatePostulate.bind(this)]
        );
        this.municipalityService.getAll().pipe(
            first(),
        ).subscribe(
            value => {
                this.data = value;
                console.log(value);
            }
        );
    }

    validatePostulate: (fg: FormGroup) => void = (fg: FormGroup) => {
        if (fg.get('district') && fg.get('district').valid && fg.get('postulate_id') && fg.get('postulate_id').valid) {
            fg.get('postulate').setErrors(null);
        } else {
            fg.get('postulate').setErrors({error: true});
        }
    };

    ngOnInit(): void {
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

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    changeMunicipalities(value) {
        this.district = value;
    }

    setSizeStepper(value: number) {
        if (this.form.get('postulate').invalid) {
            return;
        }
        // tslint:disable-next-line:max-line-length
        const positionMunicipality = (this.data.municipalities[this.district] as Array<any>).findIndex(element => element.id === this.form.get('postulate_id').value);
        this.sizeStepper = this.data.municipalities[this.district][positionMunicipality][value];
        this.ownerFormArray = new Array(this.sizeStepper).fill(null);
        this.alternateFormArray = new Array(this.sizeStepper).fill(null);
        this.controlsArray = new Array(this.sizeStepper).fill(Math.random() * 100);
        this.createArrayCandidates();
    }

    private createArrayCandidates() {
        this.candidatesFormArray = new FormArray([]);
        Swal.showLoading();
        (this.form.get('candidates') as FormArray).setControl(0, this.candidatesFormArray);
        setTimeout(
            () => {
                for (let i = 0; i < this.sizeStepper; i++) {
                    this.candidatesFormArray.push(this.getControlCandidate(i));
                }
                console.log('seteados controles');
                Swal.close();
            },
            500,
        );
    }

    private getControlCandidate(position: number): FormGroup {
        return new FormGroup(
            {
                owner: this.ownerFormArray[position],
                alternate: this.alternateFormArray[position],
            }
        );
    }

    pushOwnerArray(form: FormGroup, i: number) {
        this.ownerFormArray[i] = form;
    }

    pushAlternateArray(form: FormGroup, i: number) {
        this.alternateFormArray[i] = form;
    }

    submit() {
        this.form.value.postulate = this.charges.find(element => element.id === this.form.value.postulate).chargeId;
        const dataToServer = this.cleanEmptyPairs();
        console.log(dataToServer);
    }

    private cleanEmptyPairs() {
        const copy = {...this.form.value};
        for (let i = 0; i < this.candidatesFormArray.controls.length; i++) {
            const formGroup = this.candidatesFormArray.controls[i];
            if (formGroup.invalid) {
                (copy.candidates as Array<any>).splice(i, 1);
            }
        }
        return copy;
    }
}
