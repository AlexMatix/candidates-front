import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';

@Injectable({
    providedIn: 'root'
})
export class GeocoderService {
    private URL_PATH: string;
    private KEY: string;

    constructor(private http: HttpClient) {
        this.URL_PATH = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        this.KEY = '&key=AIzaSyAHukNiEIS2AzxptYrarhGCdFJw2zmZGLY';
    }

    getLocation(address: string) {
        address = encodeURI(address);
        return this.http.get(`${this.URL_PATH}${address}${this.KEY}`);
    }

    encode_utf8(s) {
        return unescape(decodeURIComponent(escape(s)));
    }
}
