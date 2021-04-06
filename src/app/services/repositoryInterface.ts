import {Observable} from 'rxjs';
import {PaginatorModel} from '../models/paginator.model';

export interface RepositoryInterface {

    getAll(paginator: PaginatorModel): Observable<any>;
}
