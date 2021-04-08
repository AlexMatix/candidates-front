import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CandidateService} from '../../../../services/candidate.service';
import Swal from 'sweetalert2';
import MessagesUtill from '../../../../util/messages.utill';
import MessagesUtil from '../../../../util/messages.utill';
import {Router} from '@angular/router';
import {
    COMPROMISO_POR_PUEBLA,
    ERROR_MESSAGE,
    MORENA,
    NUEVA_ALIANZA,
    PSI,
    PT,
    REDES_SOCIALES_PROGRESISTAS,
    VERDE
} from '../../../../util/Config.utils';
import {GenericPaginatorDataSource} from '../../../../services/PaginatorDatasource/generic-paginator-data-source.service';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {debounceTime, skip, tap} from 'rxjs/operators';
import {ReportService} from '../../../../services/report.service';
import {UserModel} from '../../../../models/user.model';
import {saveAs} from 'file-saver';


@Component({
    selector: 'app-candidate-list',
    templateUrl: './candidate-list.component.html',
    styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() stateButtonChange = new EventEmitter();
    @Input() stateButton: boolean;

    @Output() editItemEmitter: EventEmitter<any>;
    @Input() newPolitical: boolean;
    showLoading = false;

    paginator$: Observable<any>;
    // tslint:disable-next-line:max-line-length
    displayedColumns: string[] = [
        'id',
        'father_lastname',
        'mother_lastname',
        'name',
        'nickname',
        // 'roads',
        // 'roads_name',
        // 'outdoor_number',
        // 'interior_number',
        // 'neighborhood',
        // 'zipcode',
        // 'municipality',
        'elector_key',
        // 'ocr',
        // 'cic',
        // 'emission',
        // 'entity',
        // 'section',
        // 'date_birth',
        // 'gender',
        // 'birthplace',
        // 'residence_time_year',
        // 'residence_time_month',
        // 'occupation',
        // 're_election',
        'postulate',
        'type_postulate',
        // 'indigenous_group',
        // 'group_sexual_diversity',
        // 'disabled_group',
        'politic_party_id',
        // 'postulate_id',
        // 'candidate_id',
        // 'ine_check',
        'actions'
    ];
    dataSource: GenericPaginatorDataSource<any>;
    party_color: string;
    excelTypes = [
        {id: 1, name: 'Diputados DRP', report: 1, filename: 'DiputadosDRP'},
        {id: 2, name: 'Diputados DMR', report: 2, filename: 'DiputadosDMR'},
        {id: 3, name: 'Ayuntamiento', report: 3, filename: 'Ayuntamiento'},
        {id: 4, name: 'Diputados y Presidentes para INE', report: 1, filename: 'DiputadosPresidentesINE'},
        {id: 5, name: 'Sindicaturas y Regidurias para INE', report: 2, filename: 'SindicaturasRegiduriasINE'},
    ];
    excel: any = {};
    user: UserModel;
    private valueSubject$ = new BehaviorSubject('');

    constructor(
        private _candidate: CandidateService,
        private router: Router,
        private _reports: ReportService,
    ) {

    }

    ngOnInit() {
        this.dataSource = new GenericPaginatorDataSource(this._candidate);
        this.setDataSource();
        this.user = JSON.parse(localStorage.getItem('user')) as UserModel;
        const user = JSON.parse(localStorage.getItem('user'));
        switch (user.politic_party_id) {
            case MORENA: {
                this.party_color = 'morena';
                break;
            }
            case PT: {
                this.party_color = 'pt';
                break;
            }
            case VERDE: {
                this.party_color = 'verde';
                break;
            }
            case PSI: {
                this.party_color = 'psi';
                break;
            }
            case NUEVA_ALIANZA: {
                this.party_color = 'nueva-alianza'
                break;
            }
            case COMPROMISO_POR_PUEBLA: {
                this.party_color = 'compromiso'
                break;
            }

            case REDES_SOCIALES_PROGRESISTAS: {
                this.party_color = 'redes-sociales'
                break;
            }
            default: {
                this.party_color = 'morena';
            }
        }
    }

    setDataSource() {
        this.dataSource.loadData(
            {
                current_page: this.paginator?.pageIndex ?? 1,
                value: this.valueSubject$.getValue(),
            }
        );

    }

    delete(id: number) {
        MessagesUtill.deleteMessage(id, this.callbackDeleted.bind(this));
    }

    edit(candidate) {
        console.log(candidate);
        if (candidate.postulate < 3) {
            if (candidate.type_postulate === 2) {
                this.router.navigate(['/candidate', candidate.candidate_id]);
            }
            if (candidate.type_postulate === 1) {
                this.router.navigate(['/candidate', candidate.id]);
            }
        } else {
            MessagesUtil.errorMessage(ERROR_MESSAGE);
            // this.router.navigate(['/cityHall']);
        }
    }

    generateFormat(id: number) {
        Swal.showLoading();
    }

    setFilterValue(filterValue: string) {
        this.valueSubject$.next(filterValue);
    }

    complete_ine(candidate) {
        console.log(candidate);
        this.router.navigate(['/candidate-ine', candidate.id], {queryParams: {type: candidate.type_postulate}});
    }

    ngAfterViewInit(): void {
        this.setObservables();
        this.paginator.firstPage();
    }

    generateExcel() {
        Swal.showLoading();
        if (!this.excel.id) {
            MessagesUtil.errorMessage('Seleccione un tipo de reporte');
        } else {
            if (this.excel.id <= 3) {
                this._reports.getReportByUser(this.excel.report, this.user.id).subscribe(
                    value => {
                        this.download(value);
                    },
                    error => MessagesUtil.errorMessage(ERROR_MESSAGE),
                );
            } else {
                this._reports.getCandidateINEByUser(this.excel.report, this.user.id).subscribe(
                    value => {
                        this.download(value);
                    },
                    error => MessagesUtil.errorMessage(ERROR_MESSAGE),
                );
            }


        }
    }

    private setObservables(): void {
        this.paginator$ = this.paginator.page;

        merge(this.valueSubject$.pipe(
            debounceTime(500),
            tap(() => {
                    this.showLoading = false;
                    this.paginator.firstPage();
                }
            ),
        ), this.paginator$)
            .pipe(
                skip(1),
                tap(() => {
                    console.log('Refresh');
                    this.setDataSource();
                }),
            ).subscribe(value => {
            if (this.showLoading) {
                Swal.showLoading();
            }
        });

        this.dataSource.paginatorSubject.subscribe(
            () => {
                Swal.close();
                this.showLoading = true;
            }
        );
    }

    private callbackDeleted(id: number) {
        this._candidate.delete(id).subscribe(
            response => this.setDataSource(),
            error => console.log(error),
        );
    }

    private download(file: Blob) {
        saveAs(file, this.excel.filename);
        MessagesUtil.infoMessage('Reporte Descargado con éxito');
    }
}
