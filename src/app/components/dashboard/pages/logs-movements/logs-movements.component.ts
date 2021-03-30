import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LogsMovementsModel} from '../../../../models/logsMovements.model';
import {LogsMovementService} from '../../../../services/logs-movement.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE} from '../../../../util/Config.utils';

@Component({
    selector: 'app-logs-movements',
    templateUrl: './logs-movements.component.html',
    styleUrls: ['./logs-movements.component.scss']
})
export class LogsMovementsComponent implements OnInit, AfterViewInit {
    dataSource: MatTableDataSource<LogsMovementsModel>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    displayedColumns: string[] = [
        'id',
        'type',
        'user',
        'date',
        'detail'
    ];
    notData: boolean;
    length = 10;
    pageSizeOptions: number[] = [100];
    dataPage: any;
    pagesVisited = [];

    constructor(
        private _logs: LogsMovementService
    ) {
        this.dataPage = null;
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

    setDataSource(close = true, url = '') {

        Swal.showLoading();
        if (url !== '') {
            this._logs.changePage(url).subscribe(
                response => {
                    let data = this.dataSource.data;
                    for (let log of response.data) {
                        data.push(log);
                    }
                    this.dataSource.data = data;
                    this.dataPage = response;
                    this.length++;
                    setTimeout(x => {
                        this.length--;
                        Swal.close();
                    }, 500);
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );

        } else {
            this._logs.getAll().subscribe(
                response => {
                    console.log(response);
                    this.callbackSetDataSource(response, false, close);
                },
                error => {
                    this.callbackSetDataSource(error, true, close);
                    console.log(error);
                }
            );
        }
    }

    callbackSetDataSource(item, error = false, close = true) {
        if (!error) {
            this.notData = false;
            console.log(this.notData);
            if (!_.isEmpty(item.data)) {
                this.dataSource.data = item.data;
                this.length = item.total;
                this.dataPage = item;
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

    pageEvent(event) {
        console.log('EVENT ---> ', event);
        if (event.previousPageIndex < event.pageIndex) {
            const pageVisited = this.pagesVisited.filter(x => x === event.pageIndex);
            if (_.isEmpty(pageVisited)) {
                this.pagesVisited.push(event.pageIndex);
                this.setDataSource(true, this.dataPage.next_page_url);
            }
        }
    }

    changeLength() {
        console.log('EVENT ---> 112255');
        this.length = this.length + 1;
    }

}
