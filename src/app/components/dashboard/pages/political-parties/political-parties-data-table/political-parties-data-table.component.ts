import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatSort} from '@angular/material';
import {PoliticalPartiesModel} from '../../../../../models/politicalParties.model';
import MessagesUtill from '../../../../../util/messages.utill';
import {PoliticalService} from '../../../../../services/political.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import {ERROR_MESSAGE, SECOND} from '../../../../../util/Config.utils';
import {Router} from '@angular/router';

@Component({
    selector: 'app-political-parties-data-table',
    templateUrl: './political-parties-data-table.component.html',
    styleUrls: ['./political-parties-data-table.component.scss']
})
export class PoliticalPartiesDataTableComponent implements OnInit, AfterViewInit {
    // tslint:disable-next-line:max-line-length
    displayedColumns: string[] = ['id', 'name', 'sequence', 'total', 'actions'];
    dataSource: MatTableDataSource<PoliticalPartiesModel>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    @Output() stateButtonChange = new EventEmitter();
    @Input() stateButton: boolean;

    @Output() editItemEmitter: EventEmitter<any>;
    @Input() newPolitical: boolean;
    notData: boolean;

    constructor(
        private _political: PoliticalService,
        private _route: Router
    ) {
        this.editItemEmitter = new EventEmitter<any>();
        this.notData = true;
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this.setDataSource();
        setInterval(this.setDataSourceRefresh.bind(this), SECOND * 60);
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getAction(): string {
        return !this.stateButton ? 'Añadir' : 'Cancelar';
    }

    setDataSourceRefresh() {
        this.setDataSource(false);
    }

    setDataSource(close = true) {
        if (close) {
            Swal.showLoading();

        }
        if (this._route.url === '/political-parties') {
            this._political.getAll().subscribe(
                response => {
                    console.log(response);
                    this.callbackSetDataSource(response, false, close);
                },
                error => {
                    this.callbackSetDataSource(error, true, close);
                    MessagesUtill.errorMessage(ERROR_MESSAGE);
                }
            );
        }
    }

    openAccordion() {
        this.stateButtonChange.emit(!this.stateButton);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    callbackSetDataSource(item, error = false, close = true) {
        if (!error) {
            this.notData = false;
            console.log(this.notData);
            if (!_.isEmpty(item)) {
                this.dataSource.data = item;
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

    editPolitical(element: any) {
        this.editItemEmitter.emit(element);
    }

    deletePolitical(id: any) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }

    private callbackDeleted(id: number) {
        this._political.delete(id).subscribe(
            response => {
                this.setDataSource();
            },
            error => {
                console.log(error);
            }
        );
    }
}
