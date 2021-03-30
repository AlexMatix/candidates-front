import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {DraftService} from '../../../services/draft.service';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../util/messages.utill';
import {DELETE_MESSAGE, ERROR_MESSAGE} from '../../../util/Config.utils';

@Component({
    selector: 'app-draft',
    templateUrl: './draft.component.html',
    styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {

    displayedColumns: string[] = ['id', 'date', 'actions'];
    dataSource: MatTableDataSource<any>;
    data = [];

    constructor(
        public dialogRef: MatDialogRef<DraftComponent>,
        public draftService: DraftService
    ) {
    }


    ngOnInit(): void {
        this.dataSource = new MatTableDataSource();
        Swal.showLoading();
        this.draftService.getAll().subscribe(
            response => {
                console.log(response);
                this.data = response;
                this.dataSource.data = this.data;
                Swal.close();
            }
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getTitle(): string {
        return 'Borradores';
    }

    restoreLog(element: any) {
        this.dialogRef.close(element);
    }

    deleteLog(idElement: any) {
        MessagesUtil.deleteMessage(idElement, (id) => {
            this.draftService.delete(id).subscribe(
                response => {
                    MessagesUtil.successMessage('Exito', DELETE_MESSAGE);
                    this.ngOnInit();
                }, error => {
                    MessagesUtil.errorMessage(ERROR_MESSAGE);
                }
            );
        });
    }

}
