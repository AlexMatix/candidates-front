import {Component, OnInit} from '@angular/core';
import {ERROR_MESSAGE, MORENA, PSI, PT, SAVE_MESSAGE, VERDE} from '../../../../util/Config.utils';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MunicipalitiesService} from '../../../../services/municipalities.service';
import {first, take} from 'rxjs/operators';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {CandidateService} from '../../../../services/candidate.service';

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
    controlsArray = [];
    allCandidates: any[] = [];
    private alternateFormArray: FormGroup[] = [];

    constructor(
        public municipalityService: MunicipalitiesService,
        public candidateService: CandidateService,
    ) {
        this.initializeForm();
        this.municipalityService.getAll().pipe(
            first(),
        ).subscribe(
            value => {
                this.data = value;
                console.log(value);
            }
        );
    }

    // static printErrors(form: FormGroup) {
    //     // tslint:disable-next-line:forin
    //     for (const key in form.controls) {
    //         const abstractControl = form.get(key);
    //         console.log(key, abstractControl.errors);
    //     }
    // }

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

    changeDistrict(value) {
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

    pushOwnerArray(form: FormGroup, i: number) {
        this.ownerFormArray[i] = form;
    }

    pushAlternateArray(form: FormGroup, i: number) {
        this.alternateFormArray[i] = form;
    }

    submit() {
        Swal.showLoading();
        const dataToServer = this.parseDataToServer();
        console.log('Data To Server', dataToServer);
        if (dataToServer.candidates.length === 0) {
            MessagesUtil.errorMessage('Debe llenar al menos un propietario');
            return;
        }

        this.candidateService.add(dataToServer).subscribe(
            () => {
                this.changeMunicipality(this.form.get('postulate_id').value);
                this.setCandidates();
                MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
            },
            error => {
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            }
        );

    }

    changeMunicipality($event: any) {
        this.candidateService.getCityHall($event).pipe(take(1)).subscribe(
            value => {
                console.log(value);
                this.allCandidates = value;
            }
        );
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

    private initializeForm() {
        this.form = new FormGroup({
                district: new FormControl(null, Validators.required),
                postulate_id: new FormControl(null, Validators.required),
                postulate: new FormControl(null, Validators.required),
                candidates: this.candidatesFormArray,
            },
            [this.validatePostulate.bind(this)]
        );
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
                this.setCandidates();
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

    private parseDataToServer() {
        const copy = {...this.form.value};
        copy.postulate = this.getPostulateChargeId();
        for (let i = 0; i < this.candidatesFormArray.controls.length; i++) {
            const formGroup = this.candidatesFormArray.controls[i];
            if (formGroup.get('owner').invalid) {
                (copy.candidates as Array<any>).splice(i, 1);
            }
        }
        console.log(copy);
        return copy;
    }

    private getPostulateChargeId() {
        return this.charges.find(element => element.id === this.form.value.postulate).chargeId;
    }

    private setCandidates() {
        const candidates = this.allCandidates.filter(pair => pair.owner.postulate === this.getPostulateChargeId());
        console.log(candidates);
        if (!candidates.length) {
            return;
        }

        for (let i = 0; i < candidates.length; i++) {
            this.setCandidateData(this.candidatesFormArray.controls[i].get('owner') as FormGroup, candidates[i].owner);
            this.setCandidateData(this.candidatesFormArray.controls[i].get('alternate') as FormGroup, candidates[i].alternate);
        }

    }
}
