import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
    selector: 'app-box-report-detail',
    templateUrl: './box-report-detail.component.html',
    styleUrls: ['./box-report-detail.component.scss']
})
export class BoxReportDetailComponent implements OnInit {

    dataSource: any;

    constructor(
        public dialogRef: MatDialogRef<BoxReportDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dataSource = data;
    }

    ngOnInit() {
    }

    getTitle(): string {
        return 'Reportes de conteo de casillas';
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    isEmpty(): boolean {
        return _.isEmpty(this.dataSource);
    }

}
