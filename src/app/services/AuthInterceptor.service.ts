import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {PowerService} from './power.service';
import {OauthService} from './oauth.service';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import MessagesUtil from '../util/messages.utill';

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
        return next.handle(request).pipe(
            catchError(
                response => {
                    if (response.status === 422) {
                        MessagesUtil.infoMessage('Debes modificar al menos un campo para poder editar');
                        return of(response);
                    }
                    return throwError(response);
                }
            ),
        );
    }
}
