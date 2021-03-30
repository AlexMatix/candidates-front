import {Injectable} from '@angular/core';
import {MarkerModel} from '../../models/marker.model';

@Injectable({
    providedIn: 'root'
})
export class MapsService {

    data: MarkerModel[] = [
        {
            lat: 18.999075,
            lng: -98.202015,
            label: 'Vaca Chencha',
            device: '1001',
            status: true
        },
        {
            lat: 18.999340,
            lng: -98.199224,
            label: 'Vaca Juanita',
            device: '1002',
            status: true
        },
        {
            lat: 18.998340,
            lng: -98.199224,
            label: 'Vaca Chida',
            device: '1003',
            status: false
        },
        {
            lat: 18.997343,
            lng: -98.199224,
            label: 'Vaca Manchada',
            device: '1004',
            status: true
        },
        {
            lat: 18.998256,
            lng: -98.202743,
            label: 'Vaca Lechera',
            device: '1005',
            status: true
        },
        {
            lat: 18.996511,
            lng: -98.197765,
            label: 'Vaca loca',
            device: '1006',
            status: true
        }
    ];

    constructor() {
    }

    getData(): MarkerModel[] {
        return this.data;
    }
}
