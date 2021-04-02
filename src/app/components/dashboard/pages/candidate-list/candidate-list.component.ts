import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CandidateService} from '../../../../services/candidate.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash'
import MessagesUtill from '../../../../util/messages.utill';
import {Router} from '@angular/router';
import {MORENA, PSI, PT, VERDE} from '../../../../util/Config.utils';

@Component({
    selector: 'app-candidate-list',
    templateUrl: './candidate-list.component.html',
    styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() stateButtonChange = new EventEmitter();
    @Input() stateButton: boolean;

    @Output() editItemEmitter: EventEmitter<any>;
    @Input() newPolitical: boolean;

    // tslint:disable-next-line:max-line-length
    displayedColumns: string[] = [
        'id',
        'name',
        'patter_lastname',
        'mother_lastname',
        'nickname',
        'date_birth',
        'elector_key',
        'postulate',
        'type_postulate',
        'party',
        'actions'
    ];
    dataSource: MatTableDataSource<any>;
    notData = true;

    party_color: string;


    constructor(
        private _candidate: CandidateService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource();
        this.setDataSource();

        const user = JSON.parse(localStorage.getItem('user'));
        switch(user.party) {
            case MORENA: {
                this.party_color = 'morena'
                break;
            }
            case PT: {
                this.party_color = 'pt'
                break;
            }
            case VERDE: {
                this.party_color = 'verde'
                break;
            }
            case PSI: {
                this.party_color = 'psi'
                break;
            }
            default: {
                this.party_color = 'morena'
            }
        }
    }

    setDataSource(close = true) {
        if (close) {
            Swal.showLoading();
        }
        this._candidate.getAll().subscribe(
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

    callbackSetDataSource(item, error: boolean = false, close: boolean = true) {
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

    delete(id: number) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }

    edit(id: number) {
        this.router.navigate(['/candidate',id]);
    }

    generateFormat(id: number) {
        Swal.showLoading();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    private callbackDeleted(id: number) {
        this._candidate.delete(id).subscribe(
            response => this.setDataSource(true),
            error => console.log(error)
        );
    }
}
