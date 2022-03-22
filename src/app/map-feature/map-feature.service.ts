import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

export interface Data extends Array<any>{
}

@Injectable()
export class MapFeatureService {
  constructor(
    private http: HttpClient
  ) { }

  private handleError(error: HttpErrorResponse) {
    let msg = error.status
    if (msg === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    }
    else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(msg.toString()));
  }

  configUrl = 'http://localhost:8080/map-features/';

  getMapFeatures() {
    return this.http.get<Data>(this.configUrl);
  }

  getOneMapFeature(id: string) {
    return this.http.get<Data>(this.configUrl + id).pipe(
      catchError(this.handleError)
    );
  }

  postMapFeature(data: any) {
    return this.http.post<any>(this.configUrl, data).pipe(
      catchError(this.handleError)
    );
  }
}
