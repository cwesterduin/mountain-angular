import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ResponseHelpers} from "../helpers/responseHelpers";

@Injectable()
export class EventService {
  constructor(
    private http: HttpClient
  ) { }

  configUrl = environment.url + '/events/';

  getEvents() {
    return this.http.get<any>(this.configUrl);
  }

  getOneEvent(id: string) {
      return this.http.get<any>(this.configUrl + id).pipe(
        catchError(ResponseHelpers.handleError)
      );
  }

  postEvent(data: any) {
    return this.http.post<any>(this.configUrl, data).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }

  deleteEvent(id: string) {
    return this.http.delete<any>(this.configUrl + id).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }

  deleteEventMedia(data: any) {
    return this.http.delete<any>(this.configUrl + "media/" + data).pipe(
      catchError(ResponseHelpers.handleError)
    );
  }


}
