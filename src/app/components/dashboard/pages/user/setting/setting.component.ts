import {Component, OnInit} from '@angular/core';
import {BoxesService} from '../../../../../services/boxes.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../../util/messages.utill';
import {ERROR_MESSAGE} from '../../../../../util/Config.utils';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

    panelOpenState = false;
    constructor(private _box: BoxesService) {
    }

    ngOnInit() {
    }

    submit() {
        MessagesUtil.actionMessage(
            'Coordenadas',
            '¿Desea generar las coordenadas de las casillas?',
            this.submitCallback.bind(this)
        );
    }

    submitCallback() {
        setTimeout(function () {
            Swal.showLoading();
        }, 500);

        this._box.generateCoordinates().subscribe(
            response => {
                Swal.close();
                MessagesUtil.successMessage('Éxito', response);
            },
            error => {
                Swal.close();
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            }
        );
    }
}
