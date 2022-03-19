import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Data extends Array<any>{
}

@Injectable()
export class ImageService {
  constructor(private http: HttpClient) { }

  getImages(bucket: string, folder: string) {
    return this.http.get<Data>("http://localhost:8080/s3/" + bucket + "/images?folderName=" + folder);
  }
}
