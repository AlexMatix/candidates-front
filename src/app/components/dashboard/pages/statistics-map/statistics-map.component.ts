import {Component, OnInit} from '@angular/core';
import 'leaflet';
// import * as shp from 'shpjs';
// import {SECOND} from '../../../../util/Config.utils';
import {ReportService} from '../../../../services/report.service';
import Swal from 'sweetalert2';
import {BoxesService} from '../../../../services/boxes.service';
import {GeocoderService} from '../../../../services/geocoder.service';
import {MapsAPILoader} from '@agm/core';

// import {error} from 'selenium-webdriver';

declare let L;
declare const google: any;

@Component({
    selector: 'app-statistics-map',
    templateUrl: './statistics-map.component.html',
    styleUrls: ['./statistics-map.component.scss']
})
export class StatisticsMapComponent implements OnInit {

    map: any;
    data: any;
    serverZone: any;
    zoom = 10;


    urlIcon = 'http://maps.google.com/mapfiles/ms/icons/';
    yelow = 'yellow-dot.png';
    green = 'green-dot.png';
    red = 'red-dot.png';
    private latitude: number;
    private longitude: number;


    constructor(private _report: ReportService,
                private _geocoder: GeocoderService,
                public boxesService: BoxesService,
                private mapsAPILoader: MapsAPILoader,
                ) {
        Swal.showLoading();
    }

    ngOnInit(): void {
        this.mapsAPILoader.load().then(() => {
            this.latitude = 19.005300;
            this.longitude = -98.207426;
            this.zoom = 10;
        });
    }

    init(data) {

        let icon = this.urlIcon;

        for (let item of data) {
            let title = `${item.localDistrict} ${item.municipality} ${item.section} ${item.type}`;

            if (item.lat === null || item.log === null) {
                continue;
            }
            switch (item.manager_box.length) {
                case 0 : {
                    this.drawMarkers(item.lat, item.log, title, icon + this.red);
                    break;
                }

                case 1 : {
                    this.drawMarkers(item.lat, item.log, title, icon + this.yelow);
                    break;
                }

                default : {
                    this.drawMarkers(item.lat, item.log, title, icon + this.green);
                    break;
                }
            }
        }

        Swal.close();
    }

    drawMarkers(lat, long, title, iconMarker) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            title: title,
            icon: {
                url: iconMarker
            }
        });
        marker.setMap(this.map);
    }

    protected mapReady(map) {
        this.map = map;
        map.setCenter({ lat: this.latitude, lng: this.longitude });

        console.log(this.map);
        this.map.data.loadGeoJson('./../assets/geojson/mun.json');
        this.map.data.setStyle({
            fillColor: 'blue',
            strokeWeight: 1
        });

        this.boxesService.getLocalitationBoxes().subscribe(
            reponse => {
                console.log('Boxes -->', reponse);
                this.init(reponse);
            },
            error => {
                console.log('Boxes Error -->', error);
            }
        );
    }
}
