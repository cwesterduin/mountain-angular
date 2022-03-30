import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ResponseHelpers} from "../helpers/responseHelpers";

@Injectable()
export class DndService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/s3/testbucket240222/upload/';


  postFiles(data: any) {
    return this.http.post<any>(this.configUrl, data).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }


}
