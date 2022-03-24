import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";

export class ResponseHelpers {

  static handleError(error: HttpErrorResponse) {
    let msg = error.status
    if (msg === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    }
    else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(msg.toString()));
  }

  static handlePostResponse(snackBar: MatSnackBar, router: Router, redirect?: string) {
    if (redirect) {
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

  static handlePostError(error: any, snackBar: MatSnackBar) {
    snackBar.open(error.message, "close", {
      panelClass: ['red-snackbar']
    });
  }


}
