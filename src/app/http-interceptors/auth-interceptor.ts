import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Auth } from 'aws-amplify';
import {from} from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  getToken() {
    return from(
      new Promise((resolve, reject) => {
        Auth.currentSession().then(session => {
          resolve(session.getAccessToken().getJwtToken());
        })
      })
    )
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    return this.getToken().pipe(
      mergeMap((token) => {
        const authReq = req.clone(
          {
            headers: req.headers.set('Authorization', "Bearer " + token)
          });

        return next.handle(authReq);
      })
    )
  }


}
