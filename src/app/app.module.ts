import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import { HttpClientModule } from '@angular/common/http';
import {TableService} from "./table/table.service";
import { FolderComponent } from './folder/folder.component';
import { FolderService } from "./folder/folder.service";

import {MatIconModule} from "@angular/material/icon";
import { S3ImageComponent } from './s3-image/s3-image.component';
import { DndComponent } from './dnd/dnd.component';
import {NgxFileDropModule} from "ngx-file-drop";
import { IndexComponent } from './index/index.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './login/login.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { Amplify, Auth } from 'aws-amplify';

import config from '../aws-exports';
import {CanActivateAuth} from "./can-activate-auth";
import { NavComponent } from './nav/nav.component';
import {httpInterceptorProviders} from "./http-interceptors";

Amplify.configure(config);


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    FolderComponent,
    S3ImageComponent,
    DndComponent,
    IndexComponent,
    LoginComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    NgxFileDropModule,
    RouterModule,
    AmplifyAuthenticatorModule
  ],
  providers: [
    TableService,
    FolderService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
