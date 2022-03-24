import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {ResponseHelpers} from "../helpers/responseHelpers";
import {environment} from "../../environments/environment";

export interface Data extends Array<any>{
}

@Injectable()
export class MapFeatureService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/map-features/';

  getMapFeatures() {
    return this.http.get<any>(this.configUrl);
  }

  getOneMapFeature(id: string) {
    return this.http.get<any>(this.configUrl + id).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }

  postMapFeature(data: any) {
    return this.http.post<any>(this.configUrl, data).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }
}
