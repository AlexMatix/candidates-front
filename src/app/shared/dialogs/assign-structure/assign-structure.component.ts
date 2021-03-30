import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {StructureModel} from '../../../models/structure.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {StructureService} from '../../../services/structure.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../util/Config.utils';
import {UserService} from '../../../services/user.service';
import {UserModel} from '../../../models/user.model';
import _ from 'lodash';

@Component({
    selector: 'app-assign-permissions',
    templateUrl: './assign-strcuture.component.html',
    styleUrls: ['./assign-strcuture.component.scss']
})
export class AssignStructureComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'sequence', 'actions'];
    dataSource: MatTableDataSource<StructureModel>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    userData: UserModel;
    notDada = false;
    textNotData = '';

    constructor(
        public dialogRef: MatDialogRef<AssignStructureComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _structure: StructureService,
        private _user: UserService
    ) {
        Swal.showLoading();
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this._user.getById(this.data.user.id).subscribe(
            response => {
                this.initDataUser(response);
            },
            error => MessagesUtil.errorMessage(ERROR_MESSAGE)
        );
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    initDataUser(user: UserModel) {
        Swal.close();
        this.userData = user;
        this.setDataSource();

    }

    setDataSource(close = true) {
        if (close) {
            Swal.showLoading();
        }

        if (this.data.notAssign) {
            if (_.isEmpty(this.userData.structures)) {
                this.textNotData = 'Aún no se le asignan estructurás a este usuario';
                this.notDada = true;
            } else {
                this.dataSource.data = this.userData.structures;
                this.notDada = false;
            }
        } else {
            this._structure.getAll().subscribe(
                response => {
                    this.callbackSetDataSource(response, false, close);
                },
                error => MessagesUtil.errorMessage(ERROR_MESSAGE)
            );
        }


    }

    callbackSetDataSource(item, error = false, close = true) {
        if (!error) {
            if (_.isEmpty(item)) {
                this.notDada = true;
                this.textNotData = 'Aún no se registran estructuras en el sistema';
            } else {
                this.notDada = false;
                this.dataSource.data = item;
            }
        } else {
            this.notDada = true;
        }

        if (close) {
            Swal.close();
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getTitle(): string {
        return 'Estructuras';
    }

    assignStructure(structure: StructureModel, remove = false) {
        Swal.showLoading();
        this.updateArrayStructure(structure, remove);
        this._user.edit(this.userData, this.userData.id).subscribe(
            response => {
                Swal.close();
                MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
                this.setDataSource(false);
            },
            error => MessagesUtil.errorMessage(ERROR_MESSAGE)
        );
    }

    updateArrayStructure(structure: StructureModel, remove = false) {
        if (remove) {
            // @ts-ignore
            this.userData.structures = this.userData.structures.filter(x => x.id !== structure.id);
        } else {
            // @ts-ignore
            this.userData.structures.push({id: structure.id});
        }
    }


    checkStructure(idStructure: number): boolean {

        const structure = this.userData.structures.filter(x => x['id'] === idStructure);
        if (_.isEmpty(structure)) {
            return true;
        }
        return false;
    }

}
