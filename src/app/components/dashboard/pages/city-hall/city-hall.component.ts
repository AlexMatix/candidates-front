import {Component, OnInit} from '@angular/core';
import {MORENA, PSI, PT, VERDE} from '../../../../util/Config.utils';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MunicipalitiesService} from '../../../../services/municipalities.service';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-city-hall',
    templateUrl: './city-hall.component.html',
    styleUrls: ['./city-hall.component.scss']
})
export class CityHallComponent implements OnInit {
    party_color: string;
    form: FormGroup;
    charges = [
        {id: 'presidency', value: 'Presidente'},
        {id: 'regidurias', value: 'Regidor'},
        {id: 'sindicaturas', value: 'Sindical'},
    ];

    candidatesArray = new FormArray([]);
    data: any;
    district = '0';
    sizeStepper = 0;

    constructor(
        public municipalityService: MunicipalitiesService
    ) {
        this.form = new FormGroup({
                district: new FormControl(null, Validators.required),
                municipality: new FormControl(null, Validators.required),
                charge: new FormControl(null, Validators.required),
                candidates: this.candidatesArray,
            }
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

    ngOnInit(): void {
        const user = JSON.parse(localStorage.getItem('user'));
        switch (user.party) {
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
        if (this.form.get('candidates').valid) {
            return;
        }
        const positionMunicipality = this.form.get('municipality').value;
        this.sizeStepper = this.data.municipalities[this.district][positionMunicipality][value];
        this.createArrayCandidates();
    }

    private createArrayCandidates() {
        for (let i = 0; i < this.sizeStepper; i++) {

        }
    }
}
