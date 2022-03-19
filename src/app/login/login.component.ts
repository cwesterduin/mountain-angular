import { Component, OnInit } from '@angular/core';
import { Amplify } from 'aws-amplify';
import awsExports from "../../aws-exports";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public router: Router,
  ) {
    Amplify.configure(awsExports)
  }

  ngOnInit(): void {
  }

}


