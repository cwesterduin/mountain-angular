import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Auth } from 'aws-amplify';

export interface Data extends Array<any>{
}

@Injectable()
export class FolderService {
  constructor(private http: HttpClient) { }

  configUrl = 'http://localhost:8080/s3/testbucket240222/folders/';

  getConfig() {
    return this.http.get<Data>(this.configUrl);
  }
}
