import {Component, OnInit} from '@angular/core';
import {messageErrorValidation} from '../../util/ValidatorsHelper';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PoliticalService} from '../../services/political.service';
import {saveAs} from 'file-saver';
import {ReportService} from '../../services/report.service';
import MessagesUtil from '../../util/messages.utill';
import {debuglog} from 'util';
import Swal from 'sweetalert2';
import {ERROR_MESSAGE} from '../../util/Config.utils';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    form: any;
    parties$: Observable<any>;
    excelTypes = [
        {id: 1, name: 'Diputados DRP', report: 1, filename: 'DiputadosDRP'},
        {id: 2, name: 'Diputados DMR', report: 2, filename: 'DiputadosDMR'},
        {id: 3, name: 'Ayuntamiento', report: 3, filename: 'Ayuntamiento'},
        {id: 4, name: 'Diputados y Presidentes para INE', report: 1, filename: 'DiputadosPresidentesINE'},
        {id: 5, name: 'Sindicaturas y Regidurias para INE', report: 2, filename: 'SindicaturasRegiduriasINE'},
    ];

    constructor(
        private politicalService: PoliticalService,
        private report: ReportService
    ) {
        this.form = new FormGroup({
                party: new FormControl(null),
                type: new FormControl(null, Validators.required),
            }
        );

        this.parties$ = this.politicalService.getAll();
    }

    ngOnInit() {

    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    submit() {

        let politic = null;
        if (typeof this.form.get('party').value !== 'undefined') {
            politic = this.form.get('party').value;
        }

        if (this.form.get('type').value.id <= 3) {
            this.report.getCandidateReport(this.form.get('type').value.report, politic).subscribe(
                reponse => {
                    this.success(reponse);
                },
                error => {
                    this.error(error);
                }
            );
        } else {
            this.report.getCandidateINEReport(this.form.get('type').value.report, politic).subscribe(
                reponse => {
                    this.success(reponse);
                },
                error => {
                    this.error(error);
                }
            );
        }
    }

    success(response) {
        MessagesUtil.infoMessage('El archivo se está generando, en seguida comenzará la descarga');
        this.fileDownload(response, this.form.get('type').value.filename);
    }

    error(error) {
        debuglog(error);
        Swal.close();
        MessagesUtil.errorMessage(ERROR_MESSAGE);
    }

    fileDownload(file: any, name: string) {
        saveAs(file, name);
    }
}

