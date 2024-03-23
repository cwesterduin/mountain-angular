import {Component, ElementRef, OnChanges, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";
import {Amplify, Auth} from "aws-amplify";
import awsExports from "../../aws-exports";
import {ResponseHelpers} from "../helpers/responseHelpers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavService} from "./nav.service";


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css', '../helpers/snackbar.css']
})
export class NavComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    private navService: NavService,
    private router: Router,
    public authenticator: AuthenticatorService,
  ) {
    Amplify.configure(awsExports)
  }

  signedIn = true;
  popper = 0

  async signOut() {
    try {
      await Auth.signOut();
      await this.router.navigate(["/"]);
      this.signedIn = false;
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  ngOnInit(): void {
    Amplify.configure(awsExports)
    this.authenticated()
  }


  authenticated() {
    try {
      Auth.currentUserInfo().then(res => {
        console.log(res)
        this.signedIn = !!res
      })
    } catch {
      this.signedIn = false
    }
  }

  triggerBuild() {
    this.navService.triggerBuild().subscribe({
      next: (message) => ResponseHelpers.handlePostResponseMessage(message, this._snackBar),
      error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar),
    });
  }



}
