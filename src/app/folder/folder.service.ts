import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {ResponseHelpers} from "../helpers/responseHelpers";

export interface Data extends Array<any>{
}

@Injectable()
export class FolderService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/s3/' + environment.bucket;

  getFolders() {
    return this.http.get<Data>(this.configUrl + '/folders/');
  }

  deleteS3Objects(data: any) {
    data = data.map((d: any) => d.path)
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete<any>(this.configUrl, options).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }
}
