import {Component, OnInit} from '@angular/core';
import {AuthenticatorService} from "@aws-amplify/ui-angular";
import awsExports from "../../aws-exports";
import {Amplify} from "aws-amplify";
import {IndexService} from "./index.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ResponseHelpers} from "../helpers/responseHelpers";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../helpers/snackbar.css']

})
export class IndexComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar,
    private indexService: IndexService,
    public authenticator: AuthenticatorService) {
    Amplify.configure(awsExports);
  }

  ngOnInit(): void {
  }

  triggerBuild() {
    this.indexService.triggerBuild().subscribe({
      next: (message) => ResponseHelpers.handlePostResponseMessage(message, this._snackBar),
      error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar),
    });
  }
}
