import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {messageErrorValidation} from '../../../../../util/ValidatorsHelper';
import {BoxesService} from '../../../../../services/boxes.service';
import {ReportService} from '../../../../../services/report.service';
import MessagesUtil from '../../../../../util/messages.utill';
import {ERROR_MESSAGE, FILE_DOWNLOAD_MESSAGE} from '../../../../../util/Config.utils';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    form: FormGroup;
    districts: any;
    districtSelect: number;
    dataSelect: any;
    municipalitySelect: any;
    municipalities: any;
    sections: any;
    boxesC: any;

    constructor(
        private _box: BoxesService,
        private _report: ReportService
    ) {
        this.form = new FormGroup({
            date: new FormControl('', [Validators.required]),
            dateEnd: new FormControl('', [Validators.required]),
            district: new FormControl('', []),
            municipality: new FormControl('', []),
            section: new FormControl('', []),
        });

        this._box.getAll().subscribe(
            response => this.setSelected(response),
            error => console.log(''),
        );
    }

    ngOnInit() {

    }

    submit() {
        console.log(this.form.value);


        Swal.showLoading();
        this._report.getReport(this.form.value).subscribe(
            response => {
                this.generateFile(response);
            },
            error => {
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            }
        );
    }

    generateFile(data) {
        console.log(data);
        let url: string;
        // url = window.URL.createObjectURL(new Blob([data], {type: 'xls'}));
        url = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = 'report.xlsx';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
        MessagesUtil.successMessage('Éxito', FILE_DOWNLOAD_MESSAGE);
        // console.log('Descarga completa');
    }

    setSelected(data: any) {
        console.log('DATA ORIGINAL --> ', data);
        this.dataSelect = data;
        this.districts = this.dataSelect.district
    }

    changeDistrict(district) {
        this.districtSelect = district;
        this.municipalities = this.dataSelect.municipality[district];
        this.sections = [];
        this.boxesC = [];
    }

    changeMunicipality(municipality) {
        this.municipalitySelect = municipality;
        this.sections = this.dataSelect.section[this.districtSelect][municipality];
        this.boxesC = [];
    }

    changeSection(section) {
        this.boxesC = this.dataSelect.boxC[this.districtSelect][this.municipalitySelect][section];
    }


    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }
}
