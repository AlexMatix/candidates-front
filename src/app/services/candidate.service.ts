import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL_BASE} from '../util/Config.utils';
import {RepositoryInterface} from './repositoryInterface';
import {PaginatorModel} from '../models/paginator.model';

@Injectable({
    providedIn: 'root'
})
export class CandidateService implements RepositoryInterface {

    private URL_PATH: string;

    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'candidate';
    }

    add(data: any): Observable<any> {
        return this.http.post(this.URL_PATH, data);
    }

    getAll(paginator: PaginatorModel): Observable<any> {
        const params = new HttpParams()
            .set('page', `${paginator.current_page}`)
            .set('value', `${paginator.value}`);
        return this.http.get(this.URL_PATH, {params}).pipe(map((data: any) => data.data));
    }

    getCityHall(id: number): Observable<any> {
        return this.http.get(`${URL_BASE}getAyuntamiento/${id}`).pipe(map((data: any) => data.data));
    }

    getById(id: number): Observable<any> {
        return this.http.get(`${this.URL_PATH}/${id}`).pipe(map((data: any) => data.data));
    }

    delete(id: any): Observable<any> {
        return this.http.delete(`${this.URL_PATH}/${id}`);
    }

    edit(data: any, id: number): Observable<any> {
        return this.http.put(`${this.URL_PATH}/${id}`, data);
    }

    validateElectorKey(electorKey: string, id: number): Observable<any> {
        let idParam = '';
        if (id) {
            idParam = `&id=${id}`;
        }
        return this.http.get(`${URL_BASE}validate_elector_key?electorKey=${electorKey}${idParam}`);
    }

    validateOCR(ocr: string, id: number) {
        let idParam = '';
        if (id) {
            idParam = `&id=${id}`;
        }
        return this.http.get(`${URL_BASE}validate_elector_ocr?ocr=${ocr}${idParam}`);
    }

    addIne(data) {
        return this.http.post(`${URL_BASE}candidateIne`, data);
    }

    updateIne(data, id) {
        return this.http.put(`${URL_BASE}candidateIne/${id}`, data);
    }

    getIne(id) {
        return this.http.get(`${URL_BASE}candidateIne/${id}`).pipe(map((data: any) => data.data));
    }
}
