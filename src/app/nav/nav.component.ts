import {Component, ElementRef, OnChanges, OnInit} from '@angular/core';
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

  // services = {
  //   that: this,
  //   async handleSignIn(formData: Record<string, any>,) {
  //     let {username, password } = formData;
  //     // custom username
  //     username = username.toLowerCase();
  //     let x  = await Auth.signIn({
  //       username,
  //       password,
  //     });
  //     if (x) {
  //       this.that.signedIn = true;
  //       return x
  //     }
  //   },
  // }
  // pop(){
  //   setInterval(() => {
  //     console.log("hello")
  //     let btnElements = (<HTMLElement>this.ElByClassName.nativeElement).querySelectorAll(
  //       '.amplify-button'
  //     );
  //     console.log(btnElements.length)
  //     for (let i = 0; i < btnElements.length; i++) {
  //       btnElements[i].className = "mat-raised-button mat-focus-indicator mat-button-base mat-primary"
  //       btnElements[i].setAttribute("mat-raised-button", "")
  //     }
  //   }, 1)
  // }


}
