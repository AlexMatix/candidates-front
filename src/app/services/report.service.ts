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
        this.URL_PATH = URL_BASE;
    }

    getCandidateReport(report_id: number, politic_party_id: number = null) {
        let politic = '';
        if (politic_party_id !== null) {
            politic = `&politic_party_id=${politic_party_id}`;
        }

        return this.http.get(`${this.URL_PATH}createReport?type=${report_id}${politic}`, {responseType: 'blob'});
    }

    getCandidateINEReport(report_id: number, politic_party_id: number = null) {
        let politic = '';
        if (politic_party_id !== null) {
            politic = `&politic_party_id=${politic_party_id}`;
        }

        return this.http.get(`${this.URL_PATH}createReportIne?type=${report_id}${politic}`, {responseType: 'blob'});
    }
}
