import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {ResponseHelpers} from "../helpers/responseHelpers";

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
  updateDescription(id: string, description: string) {
    let configUrl = environment.url + '/s3/description/' + id + "/" + description;
    return this.http.post<any>(configUrl, {}).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }
}
