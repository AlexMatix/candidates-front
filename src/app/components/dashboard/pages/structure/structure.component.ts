import {Component, OnInit, ViewChild} from '@angular/core';
import {StructureDataTableComponent} from './structure-data-table/structure-data-table.component';
import {StructureModel} from '../../../../models/structure.model';
import {StructureService} from '../../../../services/structure.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {messageErrorValidation} from '../../../../util/ValidatorsHelper';
import MessagesUtil from '../../../../util/messages.utill';
import Swal from 'sweetalert2';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../util/Config.utils';

@Component({
    selector: 'app-structure',
    templateUrl: './structure.component.html',
    styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit {

    editForm = false;
    @ViewChild(StructureDataTableComponent, {static: false})
    dataTable: StructureDataTableComponent;
    panelOpenState = false;
    form: FormGroup;
    id: number;

    constructor(public structureService: StructureService) {
        this.form = new FormGroup({
            structure_name: new FormControl('', Validators.required),
            quantity: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
    }

    setStatusOpenState(status: boolean) {
        if (!status) {
            this.form.reset();
            this.editForm = false;
        }
    }

    editStructure(data: StructureModel) {
        this.id = data.id;
        this.form.get('structure_name').setValue(data.structure_name);
        this.form.get('quantity').setValue(data.quantity);
        this.editForm = true;
        this.panelOpenState = true;
    }

    submit() {
        Swal.showLoading();
        console.log(this.form.value);
        if (!this.editForm) {
            this.structureService.add(
                this.form.value
            ).subscribe(
                response => {
                    MessagesUtil.successMessage('Añadido', SAVE_MESSAGE);
                    this.successSave();
                }, error => {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        } else {
            this.structureService.edit(this.form.value, this.id).subscribe(
                response => {
                    MessagesUtil.successMessage('Editado', SAVE_MESSAGE);
                    this.successSave();
                }, error => {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        }
        this.panelOpenState = false;
    }

    successSave() {
        this.dataTable.setDataSource(false);
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.editForm = false;
        this.form.reset();
        this.panelOpenState = false;
    }

    getMessageError(attrName: string) {
        return messageErrorValidation(this.form, attrName);
    }
}
