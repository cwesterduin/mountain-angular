import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


export interface Data {
  data: any;
}

@Injectable()
export class TableService {
  constructor(private http: HttpClient) { }
  configUrl = 'http://localhost:8080/events/';

  getConfig() {
    return this.http.get<Data>(this.configUrl);
  }
}
