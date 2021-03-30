import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private URL_PATH: string;
    data: any;


    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'reports';
    }

    getReport(data: any): Observable<any> {
        return this.http.post(this.URL_PATH, data, {responseType: 'blob'});
    }

    getGraphics() {
        return this.http.get(URL_BASE + 'graphics');
    }

    getFederalDistrict() {
        return this.http.get(URL_BASE + 'federalDistrict');
    }
}
