import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "@aws-amplify/ui-angular";
import {Amplify, Auth} from "aws-amplify";
import awsExports from "../../aws-exports";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(
    private router: Router,
    public authenticator: AuthenticatorService
  ) {
    Amplify.configure(awsExports)
  }

  signedIn = true;

  async signOut() {
    try {
      await Auth.signOut();
      await this.router.navigate(["/"]);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  ngOnInit(): void {
    Amplify.configure(awsExports)
    this.authenticated()
  }

  authenticated() {
    Auth.currentUserInfo().then(res=>{
      this.signedIn = !!res
    })
  }
}
