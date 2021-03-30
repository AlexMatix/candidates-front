import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import MessagesUtill from '../../../../../util/messages.utill';
import {UserModel} from '../../../../../models/user.model';
import {MatDialog} from '@angular/material/dialog';
import {AssignStructureComponent} from '../../../../../shared/dialogs/assign-structure/assign-structure.component';
import {UserService} from '../../../../../services/user.service';
import Swal from 'sweetalert2';
import _ from 'lodash'
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../../util/Config.utils';
import {ZoneComponent} from '../../../../../shared/dialogs/zone/zone.component';

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
    displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
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

    permissionEdit(user: any, permission: boolean) {
        let text = '';

        if (permission) {
            text = '¿Se le quitarán los permisos de edición?';
        } else {
            text = '¿Se le danrán permisos de edición?';
        }

        MessagesUtill.actionMessage(
            'Permisos de edición',
            text,
            this.assignPermission.bind(this),
            {user: user, typePermission: 'edit'}
        );
    }

    permissionDelete(user: any, permission: boolean) {
        let text = '';

        if (permission) {
            text = '¿Se le quitaran los permisos para eliminar registros?';
        } else {
            text = '¿Se le darán permisos para eliminar registros?';
        }

        MessagesUtill.actionMessage(
            'Permisos para eliminar',
            text,
            this.assignPermission.bind(this),
            {user: user, typePermission: 'delete'}
        );
    }

    private callbackDeleted(id: number) {
        this._user.delete(id).subscribe(
            response => this.setDataSource(true),
            error => console.log(error)
        );
    }

    private assignPermission(data: any) {
        Swal.showLoading();
        if (data.typePermission === 'edit') {
            data.user.configuration.permission.edit = !data.user.configuration.permission.edit;
        } else {
            data.user.configuration.permission.delete = !data.user.configuration.permission.delete;
        }
        data.user.password = null;
        this._user.edit(data.user, data.user.id).subscribe(
            response => {
                this.setDataSource(false);
                MessagesUtill.successMessage('Éxito', SAVE_MESSAGE);
            },
            error => MessagesUtill.errorMessage(ERROR_MESSAGE)
        );
    }

    private assignStructure(user: UserModel) {
        const dialogRef = this.dialog.open(AssignStructureComponent, {
            width: '70%',
            data: {
                user: user,
                notAssign: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    powerOffUser(user: UserModel) {
        let text = '';
        let title = '';
        if (user.active === 1) {
            text = 'Si apaga el sistema para este usuario no lo podrá usar hasta que se le habilite'
            title = 'Apagar sistema';
        } else {
            text = 'Se le activara nuevamente el sistema para este usuario'
            title = 'Encender sistema';
        }

        MessagesUtill.actionMessage(
            title,
            text,
            this.callbackPowerOffUser.bind(this),
            user
        );
    }

    callbackPowerOffUser(user: UserModel) {
        user.active = this.changePowerStatus(user.active);
        user.password = null;
        this._user.edit(user, user.id).subscribe(
            response => {
                MessagesUtill.successMessage('Éxito', SAVE_MESSAGE);
                this.setDataSource(false);
            },
            error => MessagesUtill.errorMessage(ERROR_MESSAGE)
        );
    }

    getPowerStatus(active): boolean {
        return active === 1;
    }

    changePowerStatus(status): number {
        return status === 1 ? 0 : 1;
    }

    listStructuresUser(user: UserModel) {
        const dialogRef = this.dialog.open(AssignStructureComponent, {
            width: '70%',
            data: {
                user: user,
                notAssign: true
            }
        });
    }

    assignZone(user: any) {
        console.log(user);
        const dialogRef = this.dialog.open(ZoneComponent, {
            width: '70%',
            data: {
                user: user,
                notAssign: true
            }
        });
    }
}
