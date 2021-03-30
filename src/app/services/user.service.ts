import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private URL_PATH: string;

    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'user';
    }

    add(data: any): Observable<any> {
        return this.http.post(this.URL_PATH, data);
    }

    getAll(report = false): Observable<any> {
        if (report) {
            return this.http.get(`${this.URL_PATH}?report`).pipe(map((data: any) => data.data));
        }
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

    getUserByToken() {
        return this.http.get(URL_BASE + 'getUserLogged').pipe(map((data: any) => data.data));
    }
}
