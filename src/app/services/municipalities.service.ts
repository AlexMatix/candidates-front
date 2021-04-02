import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_BASE} from '../util/Config.utils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MunicipalitiesService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${URL_BASE}getMunicipalities`).pipe(map((data: any) => data.data));
  }
}
