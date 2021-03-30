import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import MessagesUtil from '../../../../util/messages.utill';
import * as _ from 'lodash';
import {MapsService} from '../../../../services/maps/maps.service';
import {MatDialog} from '@angular/material/dialog';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BoxesService} from '../../../../services/boxes.service';
import {ManagerBoxService} from '../../../../services/managerBox.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ERROR_MESSAGE} from '../../../../util/Config.utils';
import {BoxReportDetailComponent} from '../../../../shared/dialogs/box-report-detail/box-report-detail.component';
import Swal from 'sweetalert2';
import {MapsAPILoader} from '@agm/core';

declare const google: any;


@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {

    map: any;
    markers = [];
    centerFlag = true;

    districts: any;
    districtSelect: number;
    dataSelect: any;
    municipalitySelect: any;
    municipalities: any;
    sections: any;
    boxesC: any;
    form: FormGroup;
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['id', 'section', 'box', 'actions'];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    private longitude: number;
    private latitude: number;
    private zoom: number;

    constructor(
        private _maps: MapsService,
        private _box: BoxesService,
        private  _manager: ManagerBoxService,
        public dialog: MatDialog,
        private mapsAPILoader: MapsAPILoader,
    ) {
        this.form = new FormGroup({
            district: new FormControl('', [Validators.required]),
            municipality: new FormControl('', [Validators.required]),
        });

        this._box.getAll().subscribe(
            response => this.setSelected(response),
            error => console.log(error),
        );
    }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            this.latitude = 19.005300;
            this.longitude = -98.207426;
            this.zoom = 15;
        });
        this.dataSource = new MatTableDataSource();

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    generateMarkers(ManagerBox) {
        if (!_.isEmpty(this.markers)) {
            this.markers = [];
        }
        let center = true;
        for (let boxes of ManagerBox) {
            for (let box of boxes.boxes) {
                console.log('INICIO2 ---> ', box);

                if (center) {
                    this.map.setCenter(new google.maps.LatLng(box.pivot.lat, box.pivot.long));
                    center = false;
                }
                console.log('DEVICE ---> ', box.pivot.lat, box.pivot.long);

                let marker = new google.maps.Marker({
                    position: new google.maps.LatLng(box.pivot.lat, box.pivot.long),
                    title: box.home
                });
                marker.setMap(this.map);
                this.markers.push(
                    {
                        marker: marker,
                        device: box.id,
                        center: false
                    }
                );
            }
        }
        Swal.close();
    }

    selectDevice(box: string) {
        // this.uncheckAllDeviceCenter();
        console.log('BOX SELECT --> ', box['pivot']);
        const device = this.markers.find(x => x.device === box['id']);
        this.centerMarker(device.marker);
        this.openDialog(box['pivot']['votes'])
    }

    centerMarker(marker) {
        this.map.setCenter(new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng()));
        this.map.setZoom(19);
    }


    uncheckAllDeviceCenter() {
        for (let index in this.markers) {
            this.markers[index].center = false;
        }
    }

    eventZoomChangedCallback() {
        console.log('Zoom Changed');
        if (this.map.getZoom() < 19) {
            this.uncheckAllDeviceCenter();
        }
    }

    openDialog(votes): void {
        const dialogRef = this.dialog.open(BoxReportDetailComponent, {
            width: '70%',
            data: votes
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    setSelected(data: any) {
        console.log('DATA ORIGINAL --> ', data);
        this.dataSelect = data;
        this.districts = this.dataSelect.district
    }

    changeDistrict(district) {
        this.districtSelect = district;
        this.municipalities = this.dataSelect.municipality[district];
        this.municipalities = this.dataSelect.municipality[district];
        this.sections = [];
        this.boxesC = [];
    }

    changeMunicipality(municipality) {
        this.municipalitySelect = municipality;
        this.sections = this.dataSelect.section[this.districtSelect][municipality];
        this.boxesC = [];
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    submit() {
        Swal.showLoading();
        this._manager.getBoxesFromMunicipality(this.form.get('municipality').value).subscribe(
            response => {
                console.log('DATA: --> ', response);
                this.dataSource.data = response;
                this.generateMarkers(response);
            },
            error => {
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            }
        );
    }

    protected mapReady(map) {
        this.map = map;
        this.map.addListener('zoom_changed', this.eventZoomChangedCallback.bind(this));
        map.setCenter({ lat: this.latitude, lng: this.longitude });
    }
}
