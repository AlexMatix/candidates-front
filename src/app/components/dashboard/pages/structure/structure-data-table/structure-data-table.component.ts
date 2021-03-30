import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import MessagesUtill from '../../../../../util/messages.utill';
import {StructureModel} from '../../../../../models/structure.model';
import {StructureService} from '../../../../../services/structure.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import {ERROR_MESSAGE} from '../../../../../util/Config.utils';

@Component({
    selector: 'app-structure-data-table',
    templateUrl: './structure-data-table.component.html',
    styleUrls: ['./structure-data-table.component.scss']
})
export class StructureDataTableComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'structure_name', 'sequence', 'actions'];
    dataSource: MatTableDataSource<StructureModel>;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    @Output() stateButtonChange = new EventEmitter();
    @Input() stateButton: boolean;

    @Output() editItemEmitter: EventEmitter<any>;
    @Input() newPolitical: boolean;
    notData: boolean;


    constructor(public structureService: StructureService) {
        this.editItemEmitter = new EventEmitter<any>();
    }

    ngOnInit() {
        Swal.showLoading();
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

    getAction(): string {
        return !this.stateButton ? 'Añadir' : 'Cancelar';
    }

    openAccordion() {
        this.stateButtonChange.emit(!this.stateButton);
    }

    setDataSource(close = true) {
        if (close) {
            Swal.showLoading();

        }
        this.structureService.getAll().subscribe(
            response => {
                this.callbackSetDataSource(response, false, close);
            },
            error => {
                this.callbackSetDataSource(error, true, close);
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

    editStructure(element: any) {
        this.editItemEmitter.emit(element);
    }

    deleteStructure(id: any) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }

    private callbackDeleted(id: number) {
        this.structureService.delete(id).subscribe(
            response => this.setDataSource(),
            error => console.log(error)
        );
    }
}
