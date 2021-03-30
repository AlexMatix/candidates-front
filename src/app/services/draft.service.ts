import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL_BASE} from '../util/Config.utils';

@Injectable({
    providedIn: 'root'
})
export class DraftService {

    private URL_PATH: string;

    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'draft';
    }

    add(data: any): Observable<any> {
        return this.http.post(this.URL_PATH, data);
    }

    getAll(): Observable<any> {
        return this.http.get(this.URL_PATH).pipe(map((data: any) => data.data));
    }

    getById(id: number): Observable<any> {
        return this.http.get(`${this.URL_PATH}/${id}`).pipe(map((data: any) => data.data));
    }

    delete(id: any): Observable<any> {
        return this.http.delete(`${this.URL_PATH}/${id}`);
    }

    edit(data: any, id: number): Observable<any> {
        console.log(data);
        return this.http.put(`${this.URL_PATH}/${id}`, data);
    }
}
