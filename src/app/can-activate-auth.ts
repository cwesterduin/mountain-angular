import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import { Auth  } from 'aws-amplify';


@Injectable()
export class CanActivateAuth implements CanActivate {
  constructor(private router: Router) {
  }
  async canActivate() {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      await this.router.navigate(['/']);
      return false;
    }
  }
}
