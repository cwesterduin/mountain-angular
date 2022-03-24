import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapFeatureService} from "./map-feature.service";
import {FolderComponent} from "../folder/folder.component";
import {MatDialog} from "@angular/material/dialog";
import {Icon, icon, latLng, LatLng, LatLngBounds, Layer, marker, polyline, tileLayer} from "leaflet";

@Component({
  selector: 'app-create-map-feature',
  templateUrl: './create-map-feature.html',
  styleUrls: ['../event/event.component.css', './map-feature.component.css']
})
export class CreateMapFeatureComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private mapFeatureService: MapFeatureService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }

  public found: boolean | undefined;
  public loading: boolean = true;
  public id: string | undefined
  public media: any

  public options: any;
  public layers: Layer[] = [];
  public center: LatLng = new LatLng(55, -3)
  public fitToBounds: LatLngBounds

  mapFeatureForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(''),
    lat: new FormControl(''),
    lng: new FormControl(''),
    translation: new FormControl(''),
    pronunciation: new FormControl(''),
    munroOrder: new FormControl(''),
    image: new FormControl('')
  });

  ngOnInit(): void {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
      ],
      zoom: 5,
      center: [55,-3]
    };
    this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      this.id = params["id"]
    })
    if (this.id) {
      this.mapFeatureService.getOneMapFeature(this.id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    } else {
      this.loading = false
      this.found = true
    }
  }

  handleResponse(data: any) {
    this.mapFeatureForm.patchValue({
      name: data["name"],
      type: data["type"],
      lat: data["coordinate"] ? data["coordinate"][0] : '',
      lng: data["coordinate"] ? data["coordinate"][1] : '',
      translation: data["translation"],
      pronunciation: data["pronunciation"],
      munroOrder: data["munroOrder"]
    })
    this.media = data["primaryImage"]
    this.media.path = "https://" + this.media.bucketName + ".s3." + this.media.region + ".amazonaws.com/" + this.media.path

    if (data.coordinate) {
      this.layers = [marker(data.coordinate, {
        icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'leaflet/marker-icon.png',
          shadowUrl: 'leaflet/marker-shadow.png'
        })
      })]
      this.center = latLng([data.coordinate[0], data.coordinate[1]])
      this.fitToBounds = this.center.toBounds(10000);
    }


    this.found = true
    this.loading = false
  }

  handlePostResponse(data: any) {
    this._snackBar.open("success", "close", {
      panelClass: ['green-snackbar']
    });
  }

  handlePostError(error: any) {
    this._snackBar.open(error.message, "close", {
      panelClass: ['red-snackbar']
    });
  }

  handleError(error: any) {
    if (error.message == "404") {
      this.found = false
    }
    this.loading = false
  }

  onSubmit() {
    let data = this.mapFeatureForm.value
    data.coordinate = [data.lat, data.lng]
    data.primaryImage = this.media
    if (this.id) {
      data.id = this.id
      this.mapFeatureService.postMapFeature(data).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handlePostError.bind(this),
      });
    } else {
      this.mapFeatureService.postMapFeature(data).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handlePostError.bind(this),
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(FolderComponent, {
      panelClass: 'large-dialog',
      data: {
        appendMedia: (image: any) => this.media = {
          ...image,
          path: "https://" + image.bucketName + ".s3." + image.region + ".amazonaws.com/" + image.path
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  updateMarker() {
    if (this.mapFeatureForm.value.lat && this.mapFeatureForm.value.lng) {
      this.layers = [marker([this.mapFeatureForm.value.lat, this.mapFeatureForm.value.lng], {
        icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'leaflet/marker-icon.png',
          shadowUrl: 'leaflet/marker-shadow.png'
        })
      })]
      this.center = latLng([this.mapFeatureForm.value.lat, this.mapFeatureForm.value.lng])
      this.fitToBounds = this.center.toBounds(10000);
    }
  }
}




