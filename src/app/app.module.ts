import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TableComponent} from './table/table.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from '@angular/common/http';
import {TableService} from "./table/table.service";
import {FolderComponent} from './folder/folder.component';
import {FolderService} from "./folder/folder.service";

import {MatIconModule} from "@angular/material/icon";
import {S3ImageComponent} from './s3-image/s3-image.component';
import {DndComponent} from './dnd/dnd.component';
import {NgxFileDropModule} from "ngx-file-drop";
import {IndexComponent} from './index/index.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {AmplifyAuthenticatorModule} from '@aws-amplify/ui-angular';
import {Amplify} from 'aws-amplify';

import config from '../aws-exports';
import {NavComponent} from './nav/nav.component';
import {httpInterceptorProviders} from "./http-interceptors";
import {ImageService} from "./s3-image/s3-image.service";
import {EventComponent} from './event/event.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {EventService} from "./event/event.service";
import {CreateEventComponent} from "./event/create-event.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { MapFeatureComponent } from './map-feature/map-feature.component';

Amplify.configure(config);


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    FolderComponent,
    S3ImageComponent,
    DndComponent,
    IndexComponent,
    NavComponent,
    EventComponent,
    CreateEventComponent,
    MapFeatureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    NgxFileDropModule,
    MatDialogModule,
    RouterModule,
    AmplifyAuthenticatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    TableService,
    FolderService,
    ImageService,
    EventService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
