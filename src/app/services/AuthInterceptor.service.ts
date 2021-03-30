import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PowerService} from './power.service';
import {ACTIVE_SYSTEM, ADMIN, DISABLE_SYSTEM} from '../util/Config.utils';
import {OauthService} from './oauth.service';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _power: PowerService,
        private _oauth: OauthService,
        private _router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');
        let request = req;
        if (token) {
            request = req.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }
}
