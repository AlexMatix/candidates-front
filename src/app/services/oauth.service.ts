import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ACTIVE_SYSTEM, CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, URL_BASE} from '../util/Config.utils';

@Injectable({
    providedIn: 'root'
})
export class OauthService {

    private URL_PATH: string;
    private loginStatus = false;

    constructor(private http: HttpClient) {
        this.URL_PATH = URL_BASE + 'oauth/token';
    }

    login(data) {

        const oauth = {
            grant_type: GRANT_TYPE,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            username: data.username,
            password: data.password
        };

        return this.http.post(this.URL_PATH, oauth);
    }

    setToken(token) {
        localStorage.setItem('token_data', JSON.stringify(token));
        localStorage.setItem('token', token.access_token);
    }

    setUserLogin(data) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('power', data.active);
        this.loginStatus = true;
    }

    isLogged(): boolean {
        return this.loginStatus;
    }

    logout() {
        this.loginStatus = false;
        localStorage.clear();
    }

}
