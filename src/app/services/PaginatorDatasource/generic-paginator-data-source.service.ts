import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {map, tap} from 'rxjs/operators';
import {PaginatorModel} from '../../models/paginator.model';
import {RepositoryInterface} from '../repositoryInterface';

@Injectable({
    providedIn: 'root'
})
export class GenericPaginatorDataSource<T> implements DataSource<T> {
    private dataSubject = new BehaviorSubject<T[]>([]);

    constructor(public repository: RepositoryInterface) {
    }

    private _emptySubject = new BehaviorSubject<boolean>(true);

    get emptySubject(): Observable<boolean> {
        return this._emptySubject.asObservable();
    }

    private _paginatorSubject = new BehaviorSubject<PaginatorModel>({orderBy: '', quantity: '', current_page: 1, last_page: 0, total: 0});

    get paginatorSubject(): Observable<PaginatorModel> {
        return this._paginatorSubject.asObservable();
    }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this._emptySubject.complete();
        this._paginatorSubject.complete();
        console.log('Se mueren los observadores');
    }

    loadData(paginator: PaginatorModel) {
        console.log('llamando');
        this.repository.getAll(paginator).pipe(
            tap((next: any) => {
                console.log('solicitud');
                this._emptySubject.next(next.data.length === 0);
                this._paginatorSubject.next({
                    orderBy: '',
                    quantity: '',
                    current_page: next.current_page,
                    last_page: next.last_page,
                    total: next.total
                });
            }),
            map((data: any) => data.data),
        ).subscribe(
            value => this.dataSubject.next(value)
        );
    }
}
