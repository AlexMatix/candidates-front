import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MapsAPILoader} from '@agm/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-location-job-center',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

    latitude: number;
    longitude: number;
    zoom = 6;

    constructor(
        public dialogRef: MatDialogRef<LocationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private mapsAPILoader: MapsAPILoader,
    ) {
        Swal.showLoading();
    }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            this.latitude = this.data.latitude;
            this.longitude = this.data.longitude;
            this.zoom = 15;
        });
    }

    protected mapReady(map) {
        map.setCenter({ lat: parseFloat(this.data.latitude), lng: parseFloat(this.data.longitude) });
        Swal.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
