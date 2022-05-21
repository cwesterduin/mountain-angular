import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";

export interface Data extends Array<any>{
}

@Injectable()
export class ImageService {
  constructor(
    private http: HttpClient
  ) { }

  getImages(folder: string) {
    let configUrl = environment.url + '/s3/' + environment.bucket + "/images?folderName=";
    return this.http.get<Data>(configUrl + folder);
  }
}
