import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import MessagesUtill from '../../../../../util/messages.utill';
import {UserModel} from '../../../../../models/user.model';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../../../services/user.service';
import Swal from 'sweetalert2';
import _ from 'lodash'

@Component({
    selector: 'app-user-data-table',
    templateUrl: './user-data-table.component.html',
    styleUrls: ['./user-data-table.component.scss']
})
export class UserDataTableComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    @Output() stateButtonChange = new EventEmitter();
    @Input() stateButton: boolean;

    @Output() editItemEmitter: EventEmitter<any>;
    @Input() newPolitical: boolean;

    // tslint:disable-next-line:max-line-length
    displayedColumns: string[] = ['id', 'name', 'email', 'role', 'party', 'actions'];
    dataSource: MatTableDataSource<UserModel>;
    notData = true;

    constructor(
        public dialog: MatDialog,
        private _user: UserService
    ) {
        this.editItemEmitter = new EventEmitter<any>();
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this.setDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getAction(): string {
        return !this.stateButton ? 'Añadir' : 'Cancelar';
    }

    openAccordion() {
        this.stateButtonChange.emit(!this.stateButton);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDataSource(close = true) {
        if (close) {
            Swal.showLoading();
        }
        this._user.getAll().subscribe(
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

    editUser(element: any) {
        this.editItemEmitter.emit(element);
    }

    deleteUser(id: any) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }

    private callbackDeleted(id: number) {
        this._user.delete(id).subscribe(
            response => this.setDataSource(true),
            error => console.log(error)
        );
    }
}
