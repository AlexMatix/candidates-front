import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BoxModel} from '../../../../../models/box.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import MessagesUtill from '../../../../../util/messages.utill';
import {ManagerBoxService} from '../../../../../services/managerBox.service';
import Swal from 'sweetalert2';
import _ from 'lodash'
import {ADMIN, ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../../util/Config.utils';
import {Router} from '@angular/router';


@Component({
    selector: 'app-logs-data-table',
    templateUrl: './logs-data-table.component.html',
    styleUrls: ['./logs-data-table.component.scss']
})
export class LogsDataTableComponent implements OnInit, AfterViewInit {

    dataSource: MatTableDataSource<BoxModel>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    displayedColumns: string[] = [
        'id',
        'name',
        'motherLastName',
        'fatherLastName',
        'curp',
        'electorKey',
        'district',
        'localDistrict',
        'type',
        'actions'
    ];

    displayedColumnsAdd: string[] = [
        'ocr',
        'section',
        'municipality',
        'politicalParties',
        'structure',
        'concerning',
        'colony',
        'street',
        'phone',
        'cellphone',
        'user',
        'gender',
    ];

    countViewColumn = 0;
    notData = true;
    length = 0;

    constructor(
        private _manager: ManagerBoxService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this.setDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    editBox(element: any) {
        console.log('EDITO --> ', element);
        this._router.navigate(['/new-box/' + element.id]);
    }

    deleteBox(id: any) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }


    addColumn() {
        console.log('COUNT --- DISPLAY ', this.countViewColumn, this.displayedColumnsAdd.length - 1);

        if (this.countViewColumn < (this.displayedColumnsAdd.length - 1)) {
            this.displayedColumns.pop();
            this.displayedColumns.push(this.displayedColumnsAdd[this.countViewColumn]);
            this.displayedColumns.push('actions');
            this.countViewColumn++;
        }

    }

    removeColumn() {
        if (this.countViewColumn > 0) {
            this.displayedColumns.pop();
            this.displayedColumns.pop();
            this.displayedColumns.push('actions');
            this.countViewColumn--;
        }
    }

    private callbackDeleted(id: number) {
        Swal.showLoading();
        this._manager.delete(id).subscribe(
            response => {
                this.setDataSource(false);
                MessagesUtill.successMessage('Éxito', SAVE_MESSAGE);
            },
            error => {
                MessagesUtill.errorMessage(ERROR_MESSAGE);
            }
        );
    }

    setDataSource(close = true) {

        if (close) {
            Swal.showLoading();
        }
        this._manager.getAll().subscribe(
            response => {
                console.log(response);
                this.callbackSetDataSource(response);
            },
            error => {
                MessagesUtill.errorMessage(ERROR_MESSAGE);
            }
        );

    }

    callbackSetDataSource(item, error = false, close = true) {

        if (!error) {
            this.notData = false;
            console.log(this.notData);
            if (!_.isEmpty(item)) {
                this.dataSource.data = item;
                this.length = item.length - 1;
            } else {
                this.notData = true;
            }
        } else {
            this.notData = true;
        }
        if (close) {
            Swal.close();
        }
    }

    isPermission(typePermission): boolean {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user.type === ADMIN) {
            return true
        }

        if (typePermission === 'Edit') {
            return user.configuration.permission.edit
        }

        if (typePermission === 'Delete') {
            return user.configuration.permission.delete
        }

        return false;
    }
}
