import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapFeatureService} from "./map-feature.service";
import {FolderComponent} from "../folder/folder.component";
import {MatDialog} from "@angular/material/dialog";
import {icon, latLng, LatLng, LatLngBounds, Layer, marker, tileLayer} from "leaflet";
import {ResponseHelpers} from "../helpers/responseHelpers"

@Component({
  selector: 'app-create-map-feature',
  templateUrl: './create-map-feature.html',
  styleUrls: ['./map-feature.component.css', '../helpers/snackbar.css']
})
export class CreateMapFeatureComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private mapFeatureService: MapFeatureService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
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

  selectedValue: string;
  types: string[] =  ['munro','corbett','walk','view','swim','kayak']

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
      center: [55, -3]
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
    if (this.media) {
      this.media.path = "https://" + this.media.bucketName + ".s3." + this.media.region + ".amazonaws.com/" + this.media.path
    }
    if (data.coordinate) {
      this.layers = [marker(data.coordinate, {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
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
    }
    this.mapFeatureService.postMapFeature(data).subscribe({
      next: () => ResponseHelpers.handlePostResponse(this._snackBar, this.router, '/map-features'),
      error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar),
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(FolderComponent, {
      panelClass: 'large-dialog',
      data: {
        appendMedia: (image: any) => {
          image = image[0]
          this.media = {
            ...image,
            path: "https://" + image.bucketName + ".s3." + image.region + ".amazonaws.com/" + image.path
          }
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
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'leaflet/marker-icon.png',
          shadowUrl: 'leaflet/marker-shadow.png'
        })
      })]
      this.center = latLng([this.mapFeatureForm.value.lat, this.mapFeatureForm.value.lng])
      this.fitToBounds = this.center.toBounds(10000);
    }
  }

  delete(){
    if (this.id) {
      this.mapFeatureService.deleteMapFeature(this.id).subscribe({
        next: () => ResponseHelpers.handlePostResponse(this._snackBar, this.router, '/trips'),
        error: (error) => ResponseHelpers.handlePostError(error, this._snackBar),
      });
    }
  }

}




