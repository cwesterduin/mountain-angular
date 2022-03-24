import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

export interface Data extends Array<any>{
}

@Injectable()
export class FolderService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = 'http://localhost:8080/s3/alfie192345/folders/';

  getConfig() {
    return this.http.get<Data>(this.configUrl);
  }
}
