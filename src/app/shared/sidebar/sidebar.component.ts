import {Component, OnInit} from '@angular/core';
import {PowerService} from '../../services/power.service';
import {ADMIN, DISABLE_SYSTEM, MORENA, MORENA_PT, NUEVA_ALIANZA, PSI, PT, SECOND, VERDE} from '../../util/Config.utils';
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
    {path: '/candidate/0', title: 'Nuevo Diputado', icon: 'people', class: '', permission: 2},
    {path: '/cityHall', title: 'Ayuntamiento', icon: 'villa', class: '', permission: 2},
    {path: '/candidateList', title: 'Lista de Candidatos', icon: 'list_alt', class: '', permission: 2},
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    user: UserModel;
    party_color: string;
    party_logo: string;

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
        switch (user.politic_party_id) {
            case MORENA: {
                this.party_color = 'morena'
                this.party_logo = '/assets/img/morena-logo.png'
                break;
            }
            case PT: {
                this.party_color = 'pt'
                this.party_logo = '/assets/img/pt-logo.png'
                break;
            }
            case VERDE: {
                this.party_color = 'verde'
                this.party_logo = '/assets/img/verde-logo.png'
                break;
            }
            case PSI: {
                this.party_color = 'psi'
                this.party_logo = '/assets/img/psi-logo.png'
                break;
            }
            case MORENA_PT: {
                this.party_color = 'morena'
                this.party_logo = '/assets/img/morena-pt-logo.jpeg'
                break;
            }
            case NUEVA_ALIANZA: {
                this.party_color = 'nueva-alianza'
                this.party_logo = '/assets/img/nueva-alianza-logo.png'
                break;
            }
            default: {
                this.party_color = 'morena'
                this.party_logo = '/assets/img/morena-logo.png'
            }

        }
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
