import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UserModel} from '../../../../../models/user.model';
import {UserService} from '../../../../../services/user.service';
import Swal from 'sweetalert2';
import MessagesUtill from '../../../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../../util/Config.utils';
import {AssignStructureComponent} from '../../../../../shared/dialogs/assign-structure/assign-structure.component';
import {ZoneComponent} from '../../../../../shared/dialogs/zone/zone.component';
import _ from 'lodash'
import {PromoterService} from '../../../../../services/promoter.service';
import {FormControl, Validators} from '@angular/forms';
import {LocationComponent} from '../../../../../shared/dialogs/location/location.component';

@Component({
    selector: 'app-promoters-data-table',
    templateUrl: './promoters-data-table.component.html',
    styleUrls: ['./promoters-data-table.component.scss']
})
export class PromotersDataTableComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    @Output() stateButtonChange = new EventEmitter();
    @Input() stateButton: boolean;

    @Output() editItemEmitter: EventEmitter<any>;
    @Input() newPolitical: boolean;

    // tslint:disable-next-line:max-line-length
    displayedColumns: string[] =
        [
            'id',
            'name',
            'email',
            'curp',
            'type',
            'promoter_id',
            'district',
            'municipality',
            'section',
            'actions'
        ];
    dataSource: MatTableDataSource<UserModel>;
    notData = true;

    constructor(
        public dialog: MatDialog,
        private _promoter: PromoterService
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
        this._promoter.getAll().subscribe(
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

    edit(element: any) {
        this.editItemEmitter.emit(element);
    }

    delete(id: any) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }


    private callbackDeleted(id: number) {
        this._promoter.delete(id).subscribe(
            response => this.setDataSource(true),
            error => console.log(error)
        );
    }

    private viewLocation(element) {
        const dialogRef = this.dialog.open(LocationComponent, {
            width: '80%',
            height: '70%',
            data: {
                latitude: element.lat,
                longitude: element.long,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}
