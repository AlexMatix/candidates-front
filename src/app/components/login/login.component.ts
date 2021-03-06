import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OauthService} from '../../services/oauth.service';
import {messageErrorValidation} from '../../util/ValidatorsHelper';
import MessagesUtil from '../../util/messages.utill';
import {ADMIN, DISABLE_USER, ERROR_MESSAGE, FAIL_LOGIN} from '../../util/Config.utils';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {ThemeService} from '../../services/theme.service';
import {MORENA_THEME, VERDE_TEAM} from '../../util/theme';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;

    constructor(
        private _oautn: OauthService,
        private _user: UserService,
        private _router: Router,
        private _themeService: ThemeService
    ) {
        this.form = new FormGroup({
            username: new FormControl('', [Validators.email, Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        });
    }

    ngOnInit() {
    }

    submit() {
        Swal.showLoading();
        console.log('DATA --> ', this.form.value);
        this._oautn.login(this.form.value).subscribe(
            token => {
                console.log('TOKEN --> ', token);
                this._oautn.setToken(token);
                this._user.getUserByToken().subscribe(
                    data => {
                        console.log(data);
                        console.log('USER LOGGED --> ', data);
                        this._oautn.setUserLogin(data);
                        Swal.close();
                        if (data.type === ADMIN) {
                            this._router.navigate(['/dashboard']);
                        } else {
                            this._router.navigate(['/candidate/0']);
                        }
                    },
                    fail => {
                        MessagesUtil.errorMessage(ERROR_MESSAGE);
                        console.log('ERROR --> ', fail);
                    }
                );
            },
            error => {
                if (error.status === 401) {
                    MessagesUtil.errorMessage(FAIL_LOGIN);
                } else if (error.status === 406) {
                    MessagesUtil.errorMessage(DISABLE_USER);
                } else {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            }
        );
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }
}
