import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {ResponseHelpers} from "../helpers/responseHelpers";

@Injectable()
export class NavService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/s3/';

  triggerBuild() {
    return this.http.post<any>(this.configUrl + "codebuild/mountain-dog", {}).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }


}
