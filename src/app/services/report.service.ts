import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    data: any;
    private URL_PATH: string;

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

    getReportByUser(report_id: number, user_id: number) {
        return this.http.get(`${this.URL_PATH}createReportByUser?type=${report_id}&user_id=${user_id}`, {responseType: 'blob'});
    }

    getCandidateINEByUser(report_id: number, user_id: number) {
        return this.http.get(`${this.URL_PATH}createReportIneByUser?type=${report_id}&user_id=${user_id}`, {responseType: 'blob'});
    }

    getCityHallFormat(postulateId: number, politicPartyId: number) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(`${this.URL_PATH}reportCityHall?postulate_id=${postulateId}&politic_party_id=${politicPartyId}`, {responseType: 'blob'});
    }

    getReportCityHall(postulateId: number, politicPartyId: number) {
        // tslint:disable-next-line:max-line-length
        return this.http.post(`${this.URL_PATH}ayuntamientoMunicipalityPoliticParty`, {
            district: [{id: postulateId}],
            politic_party_id: politicPartyId,
        }, {responseType: 'blob'});
    }
}
