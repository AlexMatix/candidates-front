import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BoxesService {

    private URL_PATH: string;
    data: any;

    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'box';
    }

    getAll(): Observable<any> {
        return this.http.get(this.URL_PATH).pipe(map((data: any) => {
            this.data = data.data;
            return data.data;
        }));
    }

    getById(id: number): Observable<any> {
        return this.http.get(`${this.URL_PATH}/${id}`).pipe(map((data: any) => data.data));
    }

    generateCoordinates() {
        return this.http.get(`${URL_BASE}generateCoordinates`).pipe(map((data: any) => data.data));
    }

    getLocalitationBoxes() {
        return this.http.get(`${URL_BASE}getAddressBoxes`).pipe(map((data: any) => data.data));
    }

    getMunicipalities() {
        return this.http.get(`${URL_BASE}getMunicipalities`).pipe(map((data: any) => data.data));
    }

    getBoxesByMunicipality(municipalities: any[]) {
        return this.http.post(`${URL_BASE}getBoxFilter`, {municipalities: municipalities.join(',')}).pipe(map((data: any) => {
            const array = [];
            for (const element of data.data) {
                for (const section of Object.keys(element)) {
                    for (const municipality of Object.keys(element[section])) {
                        // console.log('ELEMENT', municipality);
                        array[municipality] = element[section][municipality];
                    }
                }
            }
            return array;
        }));
    }

}
