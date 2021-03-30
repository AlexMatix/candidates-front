import {AfterContentInit, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DraftComponent} from '../../../../shared/dialogs/draft/draft.component';
import {PoliticalService} from '../../../../services/political.service';
import {PoliticalPartiesModel} from '../../../../models/politicalParties.model';
import {AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';
import {StructureModel} from '../../../../models/structure.model';
import {StructureService} from '../../../../services/structure.service';
import {ManagerBoxService} from '../../../../services/managerBox.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {DEBUG, ERROR_MESSAGE, SAVE_MESSAGE} from 'app/util/Config.utils';
import {UserModel} from '../../../../models/user.model';
import {BoxesService} from '../../../../services/boxes.service';
import {DraftService} from '../../../../services/draft.service';
import {DraftModel} from '../../../../models/draft.model';
import {ManagerBoxModel} from '../../../../models/managerBox.model';
import {debounceTime, map, share} from 'rxjs/operators';

@Component({
    selector: 'app-new-box',
    templateUrl: './new-box.component.html',
    styleUrls: ['./new-box.component.scss']
})
export class NewBoxComponent implements OnInit, AfterContentInit {

    politicalParties: PoliticalPartiesModel[] = [];

    types: any = [
        {id: 1, name: 'Propietario'},
        {id: 2, name: 'Suplente'},
        {id: 3, name: 'RG'},
    ];
    form: FormGroup;
    structures: StructureModel[];
    private isThirdType = false;
    // tslint:disable-next-line:max-line-length
    private CURP_REGEX: '/^([A-Z][AEIOUX][A-Z]{2}\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\\d])(\\d)$/';
    private EK_REGEX = '[A-Z]{6}[0-9]{8}[A-Z]{1}[0-9]{3}';
    id: number = null;
    isEditable = false;
    DEBUG = DEBUG;
    districts = [];
    municipalities = [];
    private zone = [];
    private serverZone: any;
    sections = [];
    boxes = [];
    address = 'No se ha seleccionado una casilla';

    constructor(
        public dialog: MatDialog,
        public politicalPartyService: PoliticalService,
        public structureService: StructureService,
        public managerBoxService: ManagerBoxService,
        public route: ActivatedRoute,
        public boxesService: BoxesService,
        public draftService: DraftService,
        public router: Router,
    ) {
        Swal.showLoading();
        this.form = new FormGroup({
                political_parties_id: new FormControl('', Validators.required),
                name: new FormControl('', Validators.required),
                fatherLastName: new FormControl('', Validators.required),
                motherLastName: new FormControl('', Validators.required),
                street: new FormControl('', Validators.required),
                colony: new FormControl('', Validators.required),
                curp: new FormControl('', [Validators.minLength(18), Validators.pattern(this.CURP_REGEX)], [this.curpValidator.bind(this)]),
                curp_confirm: new FormControl('', [Validators.minLength(18)]),
                // tslint:disable-next-line:max-line-length
                electorKey: new FormControl('', [Validators.required, Validators.pattern(this.EK_REGEX)], [this.keyElectorValidator.bind(this)]),
                electorKey_confirm: new FormControl('', Validators.required),
                ocr: new FormControl('', [Validators.required, Validators.minLength(13)], [this.ocrValidator.bind(this)]),
                ocr_confirm: new FormControl('', Validators.required),
                gender: new FormControl('', Validators.required),
                phone: new FormControl(''),
                cellphone: new FormControl(''),
                type: new FormControl('', Validators.required),
                district: new FormControl('', Validators.required),
                municipality: new FormControl('', Validators.required),
                section: new FormControl('', Validators.required),
                box: new FormControl('', Validators.required),
                // user_id: new FormControl('', Validators.required),
                structure_id: new FormControl('', Validators.required),
            }, [ValidatorEquals('curp', 'curp_confirm', 'notEqualsCurp'),
                ValidatorEquals('electorKey', 'electorKey_confirm', 'notEqualsElectorKey'),
                ValidatorEquals('ocr', 'ocr_confirm', 'notEqualsOCR'),
                this.combinationValidator(this).bind(this)
            ],
            []
        );

        this.setZone();
        this.politicalPartyService.getAll().subscribe(
            response => {
                this.politicalParties = response;
                const politicalParty = Number(localStorage.getItem('politicalParty'));
                if (politicalParty) {
                    this.form.get('political_parties_id').setValue(politicalParty);
                }
            }
        );
        this.structureService.getAll().subscribe(
            response => {
                this.structures = response;
                const structure = Number(localStorage.getItem('structure'));
                if (structure) {
                    this.form.get('structure_id').setValue(structure);
                }
            }
        );
        this.form.get('political_parties_id').valueChanges.subscribe(
            value => {
                localStorage.setItem('politicalParty', value);
            }
        );

        this.form.get('structure_id').valueChanges.subscribe(
            value => {
                localStorage.setItem('structure', value);
            }
        );

        this.form.get('type').valueChanges.subscribe(
            value => {
                if (value === 3) {
                    this.form.get('section').clearValidators();
                    this.form.get('box').clearValidators();
                    this.form.get('section').setErrors(null);
                    this.form.get('box').setErrors(null);
                    this.isThirdType = true;
                } else {
                    this.form.get('section').setValidators(Validators.required);
                    this.form.get('box').setValidators(Validators.required);
                    this.form.get('section').updateValueAndValidity();
                    this.form.get('box').updateValueAndValidity();
                    this.isThirdType = false;
                }
            }
        );
    }

    ngOnInit(): void {
    }

    ngAfterContentInit(): void {

    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DraftComponent, {
            width: '50%',
        });

        dialogRef.afterClosed().subscribe((result: DraftModel) => {
            if (result) {
                this.setFields(result.value);
            } else {
                console.log('The dialog was closed');
            }
        });
    }

    submit(formDirective: FormGroupDirective) {
        Swal.showLoading();
        this.form.value.concerning = 'a';
        this.setBoxes();
        console.log(this.form.value);
        const politicalParty: number = this.form.get('political_parties_id').value;
        const structure: number = this.form.get('structure_id').value;
        if (!this.isEditable) {
            this.managerBoxService.add(this.form.value).subscribe(
                response => {
                    MessagesUtil.successMessage('Exito!', 'Se ha guardado el representante de casilla');
                    this.form.reset();
                    formDirective.resetForm();
                    if (politicalParty) {
                        this.form.get('political_parties_id').setValue(politicalParty);
                    }
                    if (structure) {
                        this.form.get('structure_id').setValue(structure);
                    }
                }, error => {
                    MessagesUtil.errorMessage('Ha ocurrido un problema al guardar el representante de casilla');
                }
            );
        } else {
            this.managerBoxService.edit(this.form.value, this.id).subscribe(
                response => {
                    MessagesUtil.successMessage('Exito!', 'Se ha actualizado el representante de casilla');
                    this.router.navigate(['/add-box']);
                },
                error => {
                    MessagesUtil.errorMessage('Ha ocurrido un problema al actualizar el representante de casilla');
                }
            );
        }
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    setZone() {

        this.boxesService.getAll().subscribe(
            response => {
                console.log('DATA CRUDA --> ', response);
                this.serverZone = response;
                this.form.get('municipality').valueChanges.subscribe(
                    municipality => {
                        if (municipality) {
                            this.sections = Object.keys(this.serverZone.section[this.form.get('district').value][municipality]);
                            this.form.get('box').setValue(null);
                            this.form.get('section').setValue(null);
                        }
                    }
                );

                this.form.get('section').valueChanges.subscribe(
                    section => {
                        if (section) {
                            // tslint:disable-next-line:max-line-length
                            const boxes = this.serverZone.boxC[this.form.get('district').value][this.form.get('municipality').value][section];
                            this.boxes = [];
                            // tslint:disable-next-line:forin
                            for (const box in boxes) {
                                this.boxes.push(boxes[box]);
                            }
                            this.form.get('box').setValue(null);
                        }
                    }
                );
                Swal.close();
                this.id = Number(this.route.snapshot.params.id);
                if (!isNaN(this.id) && this.id !== 0) {
                    this.managerBoxService.getById(this.id).subscribe(
                        managerBox => {
                            this.isEditable = true;
                            this.setFields(managerBox);
                        },
                    );
                }
            }
        );
        this.zone = (JSON.parse(localStorage.getItem('user')) as UserModel).configuration.zone;

        if (typeof this.zone !== 'undefined') {
            for (const element of this.zone) {
                this.districts.push(element.district);
            }
        }

        console.log('DISTRICT --> ', this.districts);

        this.form.get('district').valueChanges.subscribe(
            response => {
                if (response) {
                    console.log('response district  -->', response);
                    console.log('response district zone  -->', this.zone);
                    this.municipalities = this.zone.find((x: any) => x.district === response).municipalities;
                    this.form.get('box').setValue(null);
                    this.form.get('section').setValue(null);
                    this.form.get('municipality').setValue(null);
                }
            }
        );
    }

    saveDraft() {
        MessagesUtil.actionMessage('Guardar Borrador', '¿Deseas Guardar el borrador?', () => {
            this.draftService.add({value: this.form.value}).subscribe(
                response => {
                    MessagesUtil.successMessage('Exito', SAVE_MESSAGE);
                },
                error => {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        });
    }

    setFields(value: ManagerBoxModel) {
        console.log(value);
        this.form.get('name').setValue(value.name);
        this.form.get('fatherLastName').setValue(value.fatherLastName);
        this.form.get('motherLastName').setValue(value.motherLastName);
        this.form.get('curp').setValue(value.curp);
        this.form.get('curp_confirm').setValue(value.curp);
        this.form.get('ocr').setValue(value.ocr);
        this.form.get('ocr_confirm').setValue(value.ocr);
        this.form.get('electorKey').setValue(value.electorKey);
        this.form.get('electorKey_confirm').setValue(value.electorKey);
        this.form.get('cellphone').setValue(value.cellphone);
        this.form.get('phone').setValue(value.phone);
        this.form.get('colony').setValue(value.colony);
        this.form.get('street').setValue(value.street);
        this.form.get('gender').setValue(value.gender);
        this.form.get('political_parties_id').setValue(value.political_parties_id);
        this.form.get('structure_id').setValue(value.structure_id);
        this.form.get('type').setValue(Number(value.type));
        this.form.get('district').setValue(value.district);
        this.form.get('municipality').setValue(value.municipality);
        this.form.get('section').setValue(value.section);
        this.form.get('box').setValue(value.box);
        this.setAddress(value.box);

        this.form.markAllAsTouched();
    }

    setBoxes() {
        const boxes = [];
        const district = this.form.get('district').value;
        const municipality = this.form.get('municipality').value;

        if (this.isThirdType) {
            const sectionsAux = this.serverZone.section[district][municipality];
            // tslint:disable-next-line:forin
            for (const keySection in sectionsAux) {
                console.log(keySection)
                const aux = this.serverZone.boxC[district][municipality][keySection];
                // tslint:disable-next-line:forin
                for (const element in aux) {
                    boxes.push({id: Number(element)});
                }
            }
        } else {
            const section = this.form.get('section').value;
            const box = this.form.get('box').value;
            const aux = this.serverZone.boxC[district][municipality][section];
            // tslint:disable-next-line:forin
            for (const element in aux) {
                if (aux[element] === box) {
                    boxes.push({id: Number(element)});
                    break;
                }
            }
        }
        this.form.value.boxes = boxes;
    }

    curpValidator(control: AbstractControl) {
        return this.managerBoxService.validateCURP(control.value, this.id).pipe(
            debounceTime(200),
            map(res => {
                return res === 'true' ? null : {curpExist: true};
            })
        );
    }

    keyElectorValidator(control: AbstractControl) {
        return this.managerBoxService.validateElectorKey(control.value, this.id).pipe(
            debounceTime(200),
            map(res => {
                this.setElectorKeyExist(res.data);
                return res.result === 'true' ? null : {keyElectorExist: true};
            })
        );
    }

    ocrValidator(control: AbstractControl) {
        return this.managerBoxService.validateOCR(control.value, this.id).pipe(
            debounceTime(200),
            map(res => {
                return res === 'true' ? null : {ocrExist: true};
            })
        );
    }

    combinationValidator(instance: any) {
        return (formGroup: FormGroup) => {
            const typeControl = formGroup.get('type');
            const political_party_idControl = formGroup.get('political_parties_id');
            const structure_idControl = formGroup.get('structure_id');
            const districtControl = formGroup.get('district');
            const municipalityControl = formGroup.get('municipality');
            const sectionControl = formGroup.get('section');
            const boxControl = formGroup.get('box');

            if (typeControl.valid && political_party_idControl.valid && structure_idControl.valid) {
                let result = false;
                if (typeControl.value === 3) {
                    console.log('rg');
                    result = districtControl.valid && municipalityControl.valid;
                } else {
                    console.log('others');
                    result = districtControl.valid && municipalityControl.valid && sectionControl.valid && boxControl.valid;
                }

                if (result) {
                    this.managerBoxService.validateCombination(typeControl.value, districtControl.value, political_party_idControl.value,
                        structure_idControl.value, municipalityControl.value, sectionControl.value, boxControl.value, this.id
                    ).pipe(
                        share(),
                        debounceTime(500),
                    ).subscribe(
                        res => {
                            console.log(res);
                            if (res === 'false') {
                                if (typeControl.value === 3) {
                                    municipalityControl.setErrors({rgExist: true});
                                } else {
                                    if (typeControl.value === 1) {
                                        boxControl.setErrors({boxOExist: true});
                                    } else {
                                        boxControl.setErrors({boxHExist: true});
                                    }
                                }
                            }
                        }
                    );
                }
            }
        }
    }

    setAddress($event: any) {
        const district = this.form.get('district').value;
        const municipality = this.form.get('municipality').value;
        const section = this.form.get('section').value;
        const aux = this.serverZone.boxC[district][municipality][section];
        let selected: any;
        // tslint:disable-next-line:forin
        for (const element in aux) {
            if (aux[element] === $event) {
                selected = element;
                break;
            }
        }
        this.boxesService.getById(selected).subscribe(
            box => {
                this.address = `${box.location}; ${box.home}; ${box.reference}`
            }
        );
    }

    onPressCUPR(value) {
        let length = this.form.get('curp').value.length + 1;
        if ((length > 4 && length < 11) || length > 16) {
            if (value.charCode >= 48 && value.charCode <= 57) {
                return true;
            }
        }
        if ((length >= 1 && length <= 4) || (length >= 11 && length <= 16)) {
            if ((value.charCode >= 65 && value.charCode <= 90) || (value.charCode >= 97 && value.charCode <= 122)) {
                return true;
            }
        }
        return false;
    }

    setElectorKeyExist(data) {
        console.log('data ----> ', data);
        if (data === null) {
            return null;
        }

        this.form.get('electorKey_confirm').setValue(data.elector_key);
        if (data.data.sex === 'M') {
            this.form.get('gender').setValue('Mujer');
        } else {
            this.form.get('gender').setValue('Hombre');
        }


        if (data.data.name.length <= 1) {
            return null;
        }

        const arrayNames = data.data.name.split(' ');

        if (arrayNames.length === 3) {
            this.form.get('name').setValue(arrayNames[2]);
            this.form.get('fatherLastName').setValue(arrayNames[0]);
            this.form.get('motherLastName').setValue(arrayNames[1]);
            return null;
        }

        const connectors = ['de', 'del', 'y', 'la', 'el'];

        let lastNameConnector = connectors.find(element => element === arrayNames[0].toLowerCase());
        let index = 0;

        if (typeof lastNameConnector === 'undefined') {
            this.form.get('fatherLastName').setValue(arrayNames[0]);
            index++;
        } else {
            lastNameConnector = connectors.find(element => element === arrayNames[1].toLowerCase());
            if (typeof lastNameConnector === 'undefined') {
                this.form.get('fatherLastName').setValue(arrayNames[0] + ' ' + arrayNames[1]);
                index = 2;
            } else {
                this.form.get('fatherLastName').setValue(arrayNames[0] + ' ' + arrayNames[1] + ' ' + arrayNames[2]);
                index = 3;
            }
        }

        lastNameConnector = connectors.find(element => element === arrayNames[index].toLowerCase());

        if (typeof lastNameConnector === 'undefined') {
            this.form.get('motherLastName').setValue(arrayNames[index]);
            index++;
        } else {
            lastNameConnector = connectors.find(element => element === arrayNames[index + 1].toLowerCase());
            if (typeof lastNameConnector === 'undefined') {
                this.form.get('motherLastName').setValue(arrayNames[index] + ' ' + arrayNames[index + 1]);
                index++;
            } else {
                this.form.get('motherLastName').setValue(arrayNames[index] + ' ' + arrayNames[index + 1] + ' ' + arrayNames[index + 2]);
                index = index + 2;
            }
        }

        let name = '';

        for (let i = index; i < arrayNames.length; i++) {
            name = name + ' ' + arrayNames[i];
        }
        this.form.get('name').setValue(name);

    }
}
