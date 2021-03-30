import {Component, NgZone, OnInit} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {PromoterService} from '../../../../services/promoter.service';
import Swal from 'sweetalert2';
import {FormControl, FormGroup} from '@angular/forms';
import {TreeNode} from 'primeng/primeng';

declare const google: any;

@Component({
    selector: 'app-map-promoters',
    templateUrl: './map-promoters.component.html',
    styleUrls: ['./map-promoters.component.scss']
})
export class MapPromotersComponent implements OnInit {

    map: any;
    operators: any;
    panelOpenState = true;
    form: FormGroup;

    latitude: number;
    longitude: number;
    zoom: number;
    markers = [];

    urlIcon = 'http://maps.google.com/mapfiles/ms/icons/';
    yelow = 'yellow-dot.png';
    green = 'green-dot.png';
    red = 'red-dot.png';
    dataChart: TreeNode[] = [];

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public promoterService: PromoterService,
    ) {

        Swal.showLoading();
        this.form = new FormGroup({
                promoter_id: new FormControl('', []),
            },
        );

        this.form.get('promoter_id').valueChanges.subscribe(
            value => {
                this.changePromoter(value);
            }
        );
    }

    changePromoter(data: any) {
        console.log('CAMBIO', data);
        this.clearMarkers();
        this.map.setCenter({lat: parseFloat(data.lat), lng: parseFloat(data.long)});
        this.zoom = 12;
        this.drawMarkers(
            parseFloat(data.lat),
            parseFloat(data.long),
            `${data.name} - ${data.section}, ${data.municipality}`,
            this.red
        );

        if (data.promoter_has.length > 0) {
            for (const promoter_has of data.promoter_has) {
                this.drawMarkers(
                    parseFloat(promoter_has.lat),
                    parseFloat(promoter_has.long),
                    `${promoter_has.name} - ${promoter_has.section}, ${promoter_has.municipality}`,
                    this.green
                );
            }
        }

        this.dataChart = [
            {
                data: data,
                expanded: true,
                children: this.getChildren(data.promoter_has),
            }
        ];

        console.log('data--->', this.dataChart);

    }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            this.zoom = 2;
        });

        this.promoterService.getOperators().subscribe(
            response => {
                console.log('response ---> ', response);
                this.operators = response;
                Swal.close();
            },
            error => {
                console.log(error);
            }
        );
    }

    mapReady(map) {
        this.map = map;
    }

    drawMarkers(lat, long, title, iconMarker) {
        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            title: title,
            icon: {
                url: this.urlIcon + iconMarker
            }
        });
        marker.setMap(this.map);
        this.markers.push(marker);
    }

    clearMarkers() {
        for (const marker of this.markers) {
            marker.setMap(null);
        }

        this.markers = [];
    }

    getChildren(promoter_has: any[]) {
        const array = [];
        for (const element of promoter_has) {
            const child: TreeNode = {
                data: element,
                expanded: true,
            };
            array.push(
                child
            )
        }
        return array;
    }
}
