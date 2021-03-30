import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {messageErrorValidation, ValidatorEquals} from '../../../../../util/ValidatorsHelper';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {UserService} from '../../../../../services/user.service';
import {StructureService} from '../../../../../services/structure.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../../util/messages.utill';
import {DELETE_MESSAGE, ERROR_MESSAGE} from '../../../../../util/Config.utils';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import _ from 'lodash'
import {MatCheckbox} from '@angular/material/checkbox';
import {ManagerBoxService} from '../../../../../services/managerBox.service';

@Component({
    selector: 'app-records-operations',
    templateUrl: './records-operations.component.html',
    styleUrls: ['./records-operations.component.scss']
})
export class RecordsOperationsComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    formTable: FormGroup;
    structuresItems: any;
    usersItems: any;
    dataSourceOrigin: MatTableDataSource<any>;
    dataSourceDestiny: MatTableDataSource<any>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChildren('checkbox') checkBoxes: QueryList<MatCheckbox>;
    displayedColumns: string[] = ['id', 'electorKey', 'box', 'actions'];
    structures: any;
    managerBoxSelect = [];
    structuresSelectOrigin = [];
    controlCheckAll = new FormControl();
    private isFirstTime = false;

    constructor(
        private _user: UserService,
        private _structure: StructureService,
        private _managerBoxService: ManagerBoxService,
        private structureService: StructureService
    ) {
        this.form = new FormGroup({
                structureOrigin: new FormControl('', []),
                structureDestiny: new FormControl('', [Validators.required]),
                user: new FormControl('', []),
            },
            [
                ValidatorEquals('structureOrigin', 'structureDestiny', 'equals', false)
            ]
        );

        this.formTable = new FormGroup({
            boxes: new FormControl('')
        });

        this._structure.getAll().subscribe(
            response => this.structuresItems = response,
            error => MessagesUtil.errorMessage(ERROR_MESSAGE)
        );

        this._user.getAll(true).subscribe(
            response => this.usersItems = response,
            error => MessagesUtil.errorMessage(ERROR_MESSAGE)
        );

        this.controlCheckAll.valueChanges.subscribe(
            check => {
                const cboxes = this.checkBoxes.toArray();
                for (const element of cboxes) {
                    element.checked = check;
                }
                if (check) {
                    for (const box of this.dataSourceOrigin.data) {
                        this.managerBoxSelect.push({id: box.id});
                    }
                } else {
                    this.managerBoxSelect = [];
                }
            }
        );
    }

    ngOnInit() {
        this.dataSourceOrigin = new MatTableDataSource();
        this.dataSourceDestiny = new MatTableDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSourceOrigin.paginator = this.paginator;
        this.dataSourceOrigin.sort = this.sort;
        this.dataSourceDestiny.paginator = this.paginator;
        this.dataSourceDestiny.sort = this.sort;
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }

    submit() {
        Swal.showLoading();
        console.log(this.form.value);
        let consult = `structureDestiny=${this.form.value.structureDestiny}`;
        if (this.form.value.structureOrigin !== null) {
            consult = `${consult}&structureOrigin=${this.form.value.structureOrigin}`;
        }
        if (this.form.value.user !== null) {
            consult = `${consult}&user=${this.form.value.user}`;
        }
        console.log('CONSULT --> ', consult);
        this._structure.getStructureCombined(consult).subscribe(
            response => {
                console.log(response);
                this.structures = response;
                Swal.close();
                this.setDataTable('origin', response);
                this.setDataTable('destiny', response);
                this.isFirstTime = true;
            },
            error => {
                console.log(error);
                if (error.status === 415) {
                    MessagesUtil.errorMessage('Tiene que seleccionar un usuario o la estrcutura origen');
                } else {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            }
        );
    }

    setDataTable(table, structures) {
        let data: any[];
        if (table === 'origin') {
            data = structures.structure_origin;
        } else {
            data = structures.structure_destiny;
        }
        let items = [];

        try {
            for (const box of data) {

                let type: any;
                console.log('BOXES --> ', box.boxes);
                if (_.isEmpty(box.boxes)) {
                    type = null;
                } else {
                    type = box.boxes[0].type;
                }

                let item = {
                    id: box.id,
                    electorKey: box.electorKey,
                    box: type,
                };
                items.push(item);
            }
        } catch (e) {
        }

        if (table === 'origin') {
            this.dataSourceOrigin.data = items;
        } else {
            this.dataSourceDestiny.data = items;
        }

    }

    submitChangeStructure() {
        console.log('FORMUALRIO  --> ', this.formTable.value);
    }

    onCheckChange(event, box) {

        console.log(event, box);
        if (event.checked) {
            this.managerBoxSelect.push({
                id: box.id
            });
        } else {
            const boxAux = this.managerBoxSelect.find(x => x.id === box.id);
            const index = this.managerBoxSelect.indexOf(boxAux, 0);
            this.managerBoxSelect.splice(index, 1);
        }
        console.log(this.managerBoxSelect);
    }

    clear(formDirective: FormGroupDirective) {
        if (this.form.touched) {
            this.setDataTable('origin', []);
            this.setDataTable('destiny', []);
            this.controlCheckAll.setValue(false);
            this.form.reset();
            formDirective.resetForm();
        } /*else {
            console.log('esta limpiando')
        }*/
    }

    changeStructure(formDirective: FormGroupDirective) {
        const data = {
            structure_destiny_id: this.form.get('structureDestiny').value,
            manager_boxes: this.managerBoxSelect,
        };
        MessagesUtil.actionMessage('¿Esta seguro de mover la estructura?', 'Se moveran todos los registros seleccionados', () => {
            this.structureService.changeStructure(data).subscribe(
                response => {
                    MessagesUtil.successMessage('Exito', 'Se han movido con éxito los registros a la estructura de destino');
                    this.form.reset();
                    formDirective.resetForm();
                    this.setDataTable('origin', []);
                    this.setDataTable('destiny', []);
                    this.controlCheckAll.setValue(false);
                }, error => {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        });
    }

    isValidStructure() {
        return this.form.get('structureDestiny').invalid || this.dataSourceDestiny.data.length > 0 || !this.isFirstTime;
    }

    deleteBox(idElement: any) {
        MessagesUtil.deleteMessage(idElement, (id) => {
            this._managerBoxService.delete(id).subscribe(
                response => {
                    MessagesUtil.successMessage('Exito', DELETE_MESSAGE);
                    this.submit();
                }, error => {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        });
    }
}
