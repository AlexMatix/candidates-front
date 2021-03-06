import {Component, OnInit, ElementRef} from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Router} from '@angular/router';
import MessagesUtil from '../../util/messages.utill';
import {PowerService} from '../../services/power.service';
import {OauthService} from '../../services/oauth.service';
import {ACTIVE_SYSTEM, ADMIN, DISABLE_SYSTEM, ERROR_MESSAGE} from '../../util/Config.utils';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(
        location: Location,
        private element: ElementRef,
        private router: Router,
        private _power: PowerService,
        private _oauth: OauthService
    ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    powerOff() {

        const status = Number(localStorage.getItem('power'));
        let title = '';
        let text = '';
        console.log('ESTATUS --> ', status);
        if (status === ACTIVE_SYSTEM) {
            title = 'Apagar sistema';
            text = 'Si apagas el sistema nadie podr?? usarlo hasta que lo prendas nuevamente';
        } else {
            title = 'Prender sistema';
            text = 'Si prendes el sistema todos los usuarios podr??n ingresar';
        }
        MessagesUtil.actionMessage(
            title,
            text,
            this.callbackPowerOff.bind(this),
        );
    }

    callbackPowerOff() {
        Swal.showLoading();
        this._power.powerON_OFF().subscribe(
            response => {
                let text = '';
                if (response['data']['status'] === ACTIVE_SYSTEM) {
                    text = 'Sistema prendido';
                    localStorage.setItem('power', ACTIVE_SYSTEM.toString());
                } else {
                    text = 'Sistema apagado';
                    localStorage.setItem('power', DISABLE_SYSTEM.toString());
                }
                MessagesUtil.successMessage('??xito', text);
            },
            error => MessagesUtil.errorMessage(ERROR_MESSAGE)
        );
    }

    logout() {
        this._oauth.logout();
        this.router.navigate(['/login']);
    }

    isPermission(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return user.type === ADMIN;
    }

}
