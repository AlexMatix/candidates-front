import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ALTERNATE, ERROR_MESSAGE, OPERATOR, OWNER, PROMOTER, SAVE_MESSAGE} from '../../../../util/Config.utils';
import {BoxesService} from '../../../../services/boxes.service';
import {MapsAPILoader} from '@agm/core';
import {debounceTime, map} from 'rxjs/operators';
import {PromoterService} from '../../../../services/promoter.service';
import {PromotersDataTableComponent} from './promoters-data-table/promoters-data-table.component';

declare let L;
declare const google: any;

@Component({
    selector: 'app-promoters',
    templateUrl: './promoters.component.html',
    styleUrls: ['./promoters.component.scss']
})
export class PromotersComponent implements OnInit {

    districts: any;
    districtSelect: number;
    dataSelect: any;
    municipalitySelect: any;
    municipalities: any;
    sections: any;
    boxesC: any;
    panelOpenState = false;
    editForm = false;
    dataEditForm: any;
    @ViewChild(PromotersDataTableComponent, {static: false})
    dataTable: PromotersDataTableComponent;
    form: FormGroup;
    alertEdit = false;
    roles: any = [
        {id: OPERATOR, name: 'Operador'},
        {id: OWNER, name: 'Propietario'},
        {id: ALTERNATE, name: 'Suplente'},
        {id: PROMOTER, name: 'Promotor del voto'},
    ];

    operators: any;
    operatorsUse: any;

    @ViewChild('search', {static: false})
    public searchElementRef: ElementRef;

    map: any;
    data: any;
    serverZone: any;

    latitude: number;
    longitude: number;
    zoom: number;
    address: string;
    private geoCoder;
    autocomplete: any;
    private CURP_REGEX: '/^([A-Z][AEIOUX][A-Z]{2}\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\\d])(\\d)$/';
    id: number = null;

    constructor(
        private _box: BoxesService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public promoterService: PromoterService,
    ) {
        Swal.showLoading();
        this.form = new FormGroup({
                name: new FormControl('', [Validators.required]),
                email: new FormControl('', [Validators.required, Validators.email]),
                curp: new FormControl('', [Validators.minLength(18), Validators.pattern(this.CURP_REGEX)], [this.curpValidator.bind(this)]),
                curp_confirm: new FormControl('', [Validators.minLength(18)]),
                type: new FormControl('', [Validators.required]),
                promoter_id: new FormControl('', []),
                district: new FormControl('', [Validators.required]),
                municipality: new FormControl('', [Validators.required]),
                section: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                lat: new FormControl('', [Validators.required]),
                long: new FormControl('', [Validators.required]),
            },
        );

        this._box.getAll().subscribe(
            response => this.setSelected(response),
            error => console.log(''),
        );

        this.promoterService.getOperators().subscribe(
            response => {
                this.operators = response;
                this.operatorsUse = response;
                console.log('response ---> ', response);

            },
            error => {
                console.log(error);
            }
        );
    }

    ngOnInit() {
        this.form.get('long').disable();
        this.form.get('lat').disable();
        this.form.get('address').disable();

        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder;
            this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            this.autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // @ts-ignore
                    let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 16;
                    this.getAddress(this.latitude, this.longitude);
                });
            });
        });


    }

    submit() {
        Swal.showLoading();
        this.form.get('long').enable();
        this.form.get('lat').enable();
        this.form.get('address').enable();

        if (this.editForm) {
            this.promoterService.edit(this.form.value, this.dataEditForm.id).subscribe(
                response => {
                    this.successSave();
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
            this.editForm = false;
            this.dataEditForm = null;
        } else {
            this.promoterService.add(this.form.value).subscribe(
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
        this.dataTable.setDataSource(false);
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.form.get('promoter_id').enable();
        this.editForm = false;
        this.form.reset();
        this.panelOpenState = false;
        this.alertEdit = false;
        this.promoterService.getOperators().subscribe(
            response => {
                this.operators = response;
                this.operatorsUse = response;
                console.log('response ---> ', response);

            },
            error => {
                console.log(error);
            }
        );

    }

    setStatusOpenState(status: boolean) {
        if (!status) {
            this.form.reset();
            this.editForm = false;
            this.alertEdit = false;
        }
    }

    edit(data) {
        this.form.get('name').setValue(data.name);
        this.form.get('email').setValue(data.email);
        this.form.get('curp').setValue(data.curp);
        this.form.get('curp_confirm').setValue(data.curp);
        this.form.get('type').setValue(data.type);
        this.form.get('promoter_id').setValue(data.promoter_id);
        this.form.get('district').setValue(data.district);
        this.form.get('municipality').setValue(data.municipality);
        this.form.get('section').setValue(data.section);
        this.form.get('address').setValue(data.address);
        this.form.get('lat').setValue(data.lat);
        this.form.get('long').setValue(data.long);

        this.panelOpenState = true;
        this.editForm = true;
        this.dataEditForm = data;
    }

    setSelected(data: any) {
        console.log('DATA ORIGINAL --> ', data);
        this.dataSelect = data;
        this.districts = this.dataSelect.district
    }

    changeDistrict(district) {
        this.districtSelect = district;
        this.municipalities = this.dataSelect.municipality[district];
        this.sections = [];
        this.boxesC = [];
    }

    changeMunicipality(municipality) {
        this.municipalitySelect = municipality;
        this.sections = this.dataSelect.section[this.districtSelect][municipality];
        this.boxesC = [];
    }

    changeSection(section) {
        this.boxesC = this.dataSelect.boxC[this.districtSelect][this.municipalitySelect][section];
    }

    isOperator(operator) {
        if (operator === OPERATOR) {
            this.operatorsUse = [];
            this.form.get('promoter_id').disable();
        } else {
            this.operatorsUse = this.operators;
            this.form.get('promoter_id').enable();
        }
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    markerDragEnd($event: MouseEvent) {
        // @ts-ignore
        this.latitude = $event.coords.lat;
        // @ts-ignore
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({'location': {lat: latitude, lng: longitude}}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 16;
                    this.address = results[0].formatted_address;
                    this.setAddress(results[0]);
                } else {
                    MessagesUtil.errorMessage('No se encontraron resultados');
                }
            } else {
                MessagesUtil.errorMessage('El servicio de google no se encuentra disponible');

            }

        });
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 16;
                this.getAddress(this.latitude, this.longitude);
            });
        }
    }

    setAddress(address) {
        this.form.get('address').setValue(this.address);
        this.form.get('lat').setValue(this.latitude);
        this.form.get('long').setValue(this.longitude);
    }

    curpValidator(control: AbstractControl) {
        return this.promoterService.validateCURP(control.value, this.id).pipe(
            debounceTime(200),
            map(res => {
                return res === 'true' ? null : {curpExist: true};
            })
        );
    }

    onPressCUPR(value) {
        const length = this.form.get('curp').value.length + 1;
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
}
