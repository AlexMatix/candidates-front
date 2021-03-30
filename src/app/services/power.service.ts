import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PowerService {
    private URL_PATH: string;

    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'active';
    }

    powerON_OFF() {
        return this.http.get(this.URL_PATH);
    }

    getStatusSystem() {
        return this.http.get(URL_BASE + 'getStatusSystem');
    }
}
