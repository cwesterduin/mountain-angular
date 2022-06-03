import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Amplify, Auth} from "aws-amplify";
import { AuthenticatorService } from "@aws-amplify/ui-angular";
import awsExports from "../aws-exports";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent {
  title = "MountainDogAngular";
}
