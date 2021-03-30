import {Component, OnInit, ViewChild} from '@angular/core';
import {PoliticalPartiesDataTableComponent} from './political-parties-data-table/political-parties-data-table.component';
import {PoliticalPartiesModel} from '../../../../models/politicalParties.model';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {PoliticalService} from '../../../../services/political.service';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../util/Config.utils';


@Component({
    selector: 'app-political-parties',
    templateUrl: './political-parties.component.html',
    styleUrls: ['./political-parties.component.scss']
})
export class PoliticalPartiesComponent implements OnInit {
    panelOpenState = false;
    editForm = false;
    dataEditForm: PoliticalPartiesModel;
    @ViewChild(PoliticalPartiesDataTableComponent, {static: false})
    dataTable: PoliticalPartiesDataTableComponent;
    form: FormGroup;
    imgFile: any;
    fileName: any;
    imagePath: any;
    imgURL: any;

    constructor(
        private _political: PoliticalService
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            image: new FormControl('', []),
            name: new FormControl('', [Validators.required]),
            sequence: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
        });
    }

    submit() {
        Swal.showLoading();
        console.log('FORM --> ', this.form.value);
        if (this.editForm) {
            console.log('SE EDITA :v');
            this._political.edit(this.form.value, this.dataEditForm.id).subscribe(
                response => {
                    this.successSave();
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
            this.editForm = false;
            this.dataEditForm = null;
        } else {
            this._political.add(this.form.value).subscribe(
                response => {
                    console.log(response);
                    this.successSave();
                },
                error => {
                    console.log(error);
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        }
    }

    successSave() {
        this.dataTable.setDataSource(false);
        MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
        this.editForm = false;
        this.imgURL = '';
        this.fileName = '';
        this.form.reset();
        this.panelOpenState = false;
    }

    setStatusOpenState(status: boolean) {
        if (!status) {
            this.form.reset();
            this.imgURL = '';
            this.fileName = '';
            this.editForm = false;
        }
    }

    editPolitical(data: PoliticalPartiesModel) {
        console.log('EDIT --> ', data);
        Swal.showLoading();
        this._political.getById(data.id).subscribe(
            response => {
                this.panelOpenState = true;
                this.form.get('name').setValue(response.name);
                this.form.get('sequence').setValue(response.sequence);
                this.fileName = response.name + '.png';
                this.imgURL = response.image;
                this.form.get('image').setValue(response.image);
                this.dataEditForm = response;
                this.editForm = true;
                Swal.close();
            },
            error => MessagesUtil.errorMessage(ERROR_MESSAGE)
        );

    }

    private onFileChange(event) {
        console.log('CAMBIO ---> ', event);

        if (event.target.files.length > 0) {
            this.imgFile = event.target.files[0];
            console.log('IF --> ', this.imgFile);
        } else {
            console.log('else');
            this.imgFile = null;
        }
    }

    uploadFile(files: any) {
        console.log(files[0]);
        this.fileName = files[0].name;
        const reader = new FileReader();
        this.imagePath = files;
        reader.onloadend = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(files[0]);
    }


    _handleReaderLoaded(e) {
        const r = e.target;
        this.imgURL = r.result;
        this.form.get('image').setValue(r.result);  /*Aqui asignamos el valor*/
    }
}
