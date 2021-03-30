import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {OauthService} from '../services/oauth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private _oatuh: OauthService) {
    }

    canActivate(): boolean {
        return this._oatuh.isLogged();
    }

}
