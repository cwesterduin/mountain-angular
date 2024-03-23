import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";

export class ResponseHelpers {

  static handleError(error: HttpErrorResponse) {
    console.log(error)
    let msg = error.status
    if (msg === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    }
    else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(JSON.stringify(error.error)));
  }

  static handlePostResponse(snackBar: MatSnackBar, router?: Router, redirect?: string) {
    if (redirect && router) {
      router.navigate([redirect]).then((navigated: boolean) => {
        if (navigated) {
          snackBar.open("success", "close", {
            panelClass: ['green-snackbar']
          });
        }
      });
    } else {
      snackBar.open("success", "close", {
        panelClass: ['green-snackbar']
      });
    }
  }

  static handlePostResponseMessage(message: any, snackBar: MatSnackBar, router?: Router, redirect?: string) {
        snackBar.open(message.message, "close", {
          panelClass: ['green-snackbar']
        });
  }

  static handlePostError(error: any, snackBar: MatSnackBar) {
    console.log(error)
    snackBar.open(error.message, "close", {
      panelClass: ['red-snackbar']
    });
  }


}
