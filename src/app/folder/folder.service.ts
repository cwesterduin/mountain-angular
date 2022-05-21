import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

export interface Data extends Array<any>{
}

@Injectable()
export class FolderService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/s3/' + environment.bucket + '/folders/';

  getConfig() {
    return this.http.get<Data>(this.configUrl);
  }
}
