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
import {UserModel} from '../../models/user.model';
import {UserService} from '../../services/user.service';

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
    allUsers: UserModel[];
    users: UserModel[];

    constructor(
        private politicalService: PoliticalService,
        private report: ReportService,
        private userService: UserService,
    ) {
        this.form = new FormGroup({
                party: new FormControl(null),
                type: new FormControl(null, Validators.required),
                user: new FormControl(null),
            }
        );

        this.parties$ = this.politicalService.getAll();
    }

    ngOnInit() {
        this.userService.getAll().subscribe(
            value => {
                this.allUsers = value;
            }
        );
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    submit() {
        Swal.showLoading();
        let politic = null;
        if (typeof this.form.get('party').value !== 'undefined') {
            politic = this.form.get('party').value;
        }

        const reportId = this.form.get('type').value.report;
        const userId = this.form.get('user').value;
        if (this.form.get('type').value.id <= 3) {

            if (this.form.get('user').value) {
                this.report.getReportByUser(reportId, userId).subscribe(
                    value => {
                        this.success(value);
                    },
                    error => MessagesUtil.errorMessage(ERROR_MESSAGE),
                );
            } else {
                this.report.getCandidateReport(reportId, politic).subscribe(
                    reponse => {
                        this.success(reponse);
                    },
                    error => {
                        this.error(error);
                    }
                );
            }

        } else {

            if (this.form.get('user').value) {
                this.report.getCandidateINEByUser(reportId, userId).subscribe(
                    value => {
                        this.success(value);
                    },
                    error => MessagesUtil.errorMessage(ERROR_MESSAGE),
                );
            } else {
                this.report.getCandidateINEReport(reportId, politic).subscribe(
                    reponse => {
                        this.success(reponse);
                    },
                    error => {
                        this.error(error);
                    }
                );
            }

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

    setUsersFilter(idPolitical: any) {
        this.users = this.allUsers.filter(user => user.politic_party_id === idPolitical);
    }
}

