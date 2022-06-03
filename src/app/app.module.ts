import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from '@angular/common/http';
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { MapFeatureComponent } from './map-feature/map-feature.component';
import {CreateMapFeatureComponent} from "./map-feature/create-map-feature";
import {MapFeatureService} from "./map-feature/map-feature.service";
import {MatPaginatorModule} from "@angular/material/paginator";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatChipsModule} from "@angular/material/chips";
import { TripComponent } from './trip/trip.component';
import { CreateTripComponent } from './trip/create-trip.component';
import {TripService} from "./trip/trip.service";
import {MatSelectModule} from "@angular/material/select";
import {DndService} from "./dnd/dnd.service";
import {MatSortModule} from "@angular/material/sort";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ConfirmationService} from "primeng/api";
import {ButtonModule} from "primeng/button";

Amplify.configure(config);


@NgModule({
  declarations: [
    AppComponent,
    FolderComponent,
    S3ImageComponent,
    DndComponent,
    IndexComponent,
    NavComponent,
    EventComponent,
    CreateEventComponent,
    CreateMapFeatureComponent,
    MapFeatureComponent,
    TripComponent,
    CreateTripComponent
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
    MatSnackBarModule,
    MatPaginatorModule,
    DragDropModule,
    MatCheckboxModule,
    LeafletModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule,
    MatSortModule,
    ConfirmPopupModule,
    ButtonModule
  ],
  providers: [
    FolderService,
    ImageService,
    EventService,
    TripService,
    MapFeatureService,
    DndService,
    httpInterceptorProviders,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
