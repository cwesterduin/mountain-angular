import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ResponseHelpers} from "../helpers/responseHelpers";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/trips/';

  getTrips() {
    return this.http.get<any>(this.configUrl);
  }

  getOneTrip(id: string) {
    return this.http.get<any>(this.configUrl + id).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }

  postTrip(data: any) {
    return this.http.post<any>(this.configUrl, data).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }

  deleteTrip(id: string) {
    return this.http.delete<any>(this.configUrl + id).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }

}
