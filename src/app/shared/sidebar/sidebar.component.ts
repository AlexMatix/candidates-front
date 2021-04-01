import {Component, OnInit} from '@angular/core';
import {PowerService} from '../../services/power.service';
import {ADMIN, DISABLE_SYSTEM, SECOND} from '../../util/Config.utils';
import {UserModel} from '../../models/user.model';
import {OauthService} from '../../services/oauth.service';
import {Router} from '@angular/router';
import MessagesUtil from '../../util/messages.utill';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission: number
}

export const ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', permission: 1},
    {path: '/users', title: 'Usuarios', icon: 'person_add', class: '', permission: 1},
    {path: '/candidate/0', title: 'Nuevo Candidato', icon: 'people', class: '', permission: 1},
    {path: '/candidateList', title: 'Lista de Candidatos', icon: 'list_alt', class: '', permission: 1},
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    user: UserModel;

    constructor(
        private _power: PowerService,
        private _oauth: OauthService,
        private _router: Router
    ) {
        // setInterval(this.checkStatusSystem.bind(this), SECOND * 30);
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('USER NAV --> ', user);
        this.menuItems = ROUTES.filter(menuItem => {
            if (menuItem.permission >= user.type) {
                return menuItem;
            }
        });
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    private checkStatusSystem() {

        this._power.getStatusSystem().subscribe(
            response => {
                if (!(this.user.type === ADMIN)) {
                    if (Number(response['data']['status']) === DISABLE_SYSTEM) {
                        this._oauth.logout();
                        MessagesUtil.errorMessage('El administrador apago el sistema, podrás iniciar cuando esté lo prenda nuevamente');
                        this._router.navigate(['/login']);
                    }
                }
            },
            error => console.log('INTERCEPTOR ERROR --> ', error)
        );
    }

    changePartity() {
        MessagesUtil.infoMessage('Cambiar de partido');
    }
}
