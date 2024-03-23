import {Component, OnInit} from '@angular/core';
import {AuthenticatorService} from "@aws-amplify/ui-angular";
import awsExports from "../../aws-exports";
import {Amplify} from "aws-amplify";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']

})
export class IndexComponent implements OnInit {

  constructor(
    public authenticator: AuthenticatorService) {
    Amplify.configure(awsExports);
  }

  ngOnInit(): void {
  }

}
