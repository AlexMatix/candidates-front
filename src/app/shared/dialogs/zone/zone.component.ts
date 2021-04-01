import {Component, ElementRef, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {BoxesService} from '../../../services/boxes.service';
import {UserModel} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import MessagesUtill from '../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../util/Config.utils';

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {
    form: FormGroup;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    districtsControl = new FormArray([]);
    districts: any[] = [];
    municipalities: any[] = [];
    filteredMunicipalities: Observable<any>[] = [];
    municipalitiesControl: FormArray[] = [];
    control: FormControl[] = [];
    @ViewChildren('auto') matAutocompletes: QueryList<MatAutocomplete>;
    @ViewChildren('municipalityInput') inputs: QueryList<ElementRef>;
    allMunicipalities: any[] = [];
    serverMunicipalities: any[] = [];

    constructor(public dialogRef: MatDialogRef<ZoneComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public boxesService: BoxesService, public userService: UserService
    ) {
        this.dialogRef.disableClose = true;
        this.boxesService.getAll().subscribe(
            response => {
                console.log(response);
                this.districts = response.district;
                this.serverMunicipalities = response.municipality;
            }
        );
    }

    ngOnInit() {
        // this.form = new FormGroup({
        //     zone: this.districtsControl,
        // });
        // const user: UserModel = this.data.user;
        // console.log(typeof user.configuration.zone);
        // if (typeof user.configuration.zone === 'undefined') {
        //     this.addDistrict();
        // } else {
        //     const zone: any[] = user.configuration.zone;
        //     for (const element of zone) {
        //         this.addDistrict(element);
        //     }
        // }
        // console.log(this.form);
    }

    onNoClick() {
        this.dialogRef.close(null);
    }

    OnSubmit() {

    }

    deleteDistrictControl(i: number) {
        this.districtsControl.removeAt(i);
        this.districts.splice(i, 1);
        this.filteredMunicipalities.splice(i, 1);
        this.municipalities.splice(i, 1);
        this.allMunicipalities.splice(i, 1);
        this.municipalitiesControl.splice(i, 1);
        this.control.splice(i, 1);

    }

    addDistrict(data: any = null) {
        this.districtsControl.push(this.newDistrictControl(data));
        const index = this.districtsControl.controls.length - 1;
        if (data) {
            // tslint:disable-next-line:forin
            for (const element of data.municipalities) {
                this.allMunicipalities[index].push(element);
                this.municipalities[index].push(element);
                this.municipalitiesControl[index].push(new FormControl(element));
            }
        }
        this.districtsControl.controls[index].get('district').valueChanges.subscribe(
            response => {
                this.allMunicipalities[index] = [];
                this.municipalities[index] = [];
                this.municipalitiesControl[index].controls = [];
                // tslint:disable-next-line:forin
                for (const element in this.serverMunicipalities[response]) {
                    const value = this.serverMunicipalities[response][element];
                    this.allMunicipalities[index].push(value);
                    this.municipalities[index].push(value);
                    this.municipalitiesControl[index].push(new FormControl(value));
                }
                // console.log(this.allMunicipalities[index]);
                this.filteredMunicipalities[index] = this.control[index].valueChanges.pipe(
                    startWith(null),
                    map((municipalities: string | null) => {
                        // console.log({municipalities});
                        // tslint:disable-next-line:max-line-length
                        return typeof municipalities === 'string' ? this._filter(municipalities, index) : this.allMunicipalities[index].slice();
                    })
                );
            }
        );
        // console.log(this);
    }

    // functions autocomplete
    remove(municipality: any, position: number): void {
        const index = this.municipalities[position].indexOf(municipality);

        if (index >= 0) {
            this.municipalities[position].splice(index, 1);
            this.municipalitiesControl[position].removeAt(index);
        }
    }

    selected(event: MatAutocompleteSelectedEvent, index: number): void {
        // console.log(event);
        if (!this.municipalities[index].find((x: string) => x === event.option.value)) {
            this.municipalities[index].push(event.option.value);
            this.municipalitiesControl[index].push(new FormControl(event.option.value));
        }
        // console.log(this.control);
        this.inputs.toArray()[index].nativeElement.value = '';
    }

    private _filter(value: string, position: number): any[] {
        // console.log(value);
        return this.allMunicipalities[position].filter(municipality => municipality.toLowerCase().includes(value.toLowerCase()));
    }

    newDistrictControl(data: any = null) {
        this.municipalitiesControl.push(new FormArray([]));
        const max = this.municipalitiesControl.length - 1;
        this.control.push(new FormControl());
        this.municipalities.push([]);
        this.allMunicipalities.push([]);
        this.filteredMunicipalities.push(
            this.control[max].valueChanges.pipe(
                startWith(null),
                map((municipalities: string | null) => {
                    // console.log({municipalities});
                    // tslint:disable-next-line:max-line-length
                    return typeof municipalities === 'string' ? this._filter(municipalities, max) : this.allMunicipalities[max].slice();
                })
            )
        );
        return new FormGroup({
            district: new FormControl(data ? data.district : null, Validators.required),
            municipalities: this.municipalitiesControl[max],
        });
    }
}
