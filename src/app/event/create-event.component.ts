import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "./event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FolderComponent} from "../folder/folder.component";
import {MatDialog} from "@angular/material/dialog";
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {map, startWith, take} from 'rxjs/operators';
import xml2js from 'xml2js';
import {
  icon,
  LatLng,
  LatLngBounds,
  Layer, marker,
  polyline,
  tileLayer
} from "leaflet";
import {Observable} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MapFeatureService} from "../map-feature/map-feature.service";
import {TripService} from "../trip/trip.service";
import {MatOptionSelectionChange} from "@angular/material/core";
import {ResponseHelpers} from "../helpers/responseHelpers";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./event.component.css', '../helpers/snackbar.css']
})
export class CreateEventComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  featureCtrl = new FormControl();
  filteredMapFeatures: Observable<any[]>;
  mapFeatures: any[] = []
  allMapFeatures: any[] = [];

  allTrips: any[] = [];
  tripControl = new FormControl();
  filteredTrips: Observable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private mapFeatureService: MapFeatureService,
    private tripService: TripService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
  }

  @ViewChild('featureInput') featureInput: ElementRef<HTMLInputElement>;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public found: boolean | undefined;
  public loading: boolean = true;
  public id: string | undefined

  public media: Array<any> = []

  public coordinates: Array<Array<number>> | undefined = undefined
  public options: any;
  public layers: Layer[] = [];
  public center: LatLng = new LatLng(55, -3)
  public fitToBounds: LatLngBounds


  eventForm = new FormGroup({
    name: new FormControl('', Validators.required),
    date: new FormControl(''),
    descriptionId: new FormControl(''),
    description: new FormControl(''),
    rating: new FormControl(''),
    elevation: new FormControl(''),
    distance: new FormControl(''),
    trip: new FormControl(''),
  });



  ngOnInit(): void {
    this.filteredMapFeatures = this.featureCtrl.valueChanges.pipe(
      startWith(null),
      map((feature: any | null) => (feature ? this._filter(feature) : this.allMapFeatures.slice())),
    );
    this.filteredTrips = this.tripControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTrips(value)),
    );
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
      this.eventService.getOneEvent(this.id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    } else {
      this.loading = false
      this.found = true
    }
    this.mapFeatureService.getMapFeatures().subscribe({
      next: this.handleFeatureResponse.bind(this),
      error: this.handleError.bind(this),
    })
    this.tripService.getTrips().subscribe({
      next: this.handleTripResponse.bind(this),
      error: this.handleError.bind(this),
    })
  }

  handleResponse(data: any) {
    this.eventForm.patchValue({
      name: data["name"],
      date: data["date"],
      descriptionId: data["descriptionId"],
      description: data["description"],
      rating: data["rating"],
      elevation: data["elevation"],
      distance: data["distance"],
    })
    this.tripControl.setValue(data["trip"])
    this.coordinates = data["coordinates"]
    this.mapFeatures = data["mapFeatures"]
    if (this.coordinates) {
      this.layers = [polyline(this.coordinates.map(m => new LatLng(m[0], m[1])))]
      this.fitToBounds = polyline(this.coordinates.map(m => new LatLng(m[0], m[1]))).getBounds()
    }
    this.mapFeatures.forEach((mf: any) => {
      this.layers.push(marker(mf.coordinate, {
          title: mf.id,
          icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        })
      )
    })

    this.media = data["media"].sort((a: any, b: any) => (a.sortOrder > b.sortOrder) ? 1 : (a.sortOrder === b.sortOrder) ? ((a.sortOrder > b.sortOrder) ? 1 : -1) : -1)
    this.found = true
    this.loading = false
  }

  handleFeatureResponse(data: any) {
    this.allMapFeatures = data
  }

  handleTripResponse(data: any) {
    this.allTrips = data
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

  handleDeleteResponse(media: any) {
    this.media = this.media.filter(m => m.mediaId != media.mediaId)
    this._snackBar.open("success", "close", {
      panelClass: ['green-snackbar']
    });
  }

  handleError(error: any) {
    if (error.message == "404") {
      this.found = false
    }
    this.loading = false
  }


  onSubmit() {
    let data = this.eventForm.value
    data.date = Date.parse(this.eventForm.get('date')?.value)
    data.coordinates = this.coordinates
    data.media = this.media.map((m, i) => ({
        ...m,
        sortOrder: i
      })
    )
    data.mapFeatures = this.mapFeatures
    data.trip = this.tripControl.value
    if (this.id) {
      data.id = this.id
    }
      this.eventService.postEvent(data).subscribe({
        next: () => ResponseHelpers.handlePostResponse(this._snackBar, this.router, '/events'),
        error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar),
      });

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.media, event.previousIndex, event.currentIndex);
    console.log(this.media)
  }

  openDialog() {
    const dialogRef = this.dialog.open(FolderComponent, {
      panelClass: 'large-dialog',
      data: {
        appendMedia: (image: any) => this.appendMedia(image),
        multiselect: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  appendMedia(images: Array<any>) {
    for (let image of images) {
      let processedImage = {
        path: "https://" + image.bucketName + ".s3." + image.region + ".amazonaws.com/" + image.path,
        mediaId: image.id,
        id: null,
        sortOrder: null,
        description: image.description
      }
      if (this.media.some(m => m.mediaId === processedImage.mediaId)) {
        this._snackBar.open("You can't add the same media twice!", "close", {
          panelClass: ['red-snackbar']
        });
      } else {
        this.media.push(processedImage)
      }
    }
  }

  removeMedia(media: any) {
    if (media.id) {
      this.eventService.deleteEventMedia(media.id).subscribe({
        next: () => this.handleDeleteResponse(media),
        error: this.handlePostError.bind(this),
      });
    } else {
      this.media = this.media.filter(m => m.mediaId != media.mediaId)
    }
  }

  parseGPX(fileInputEvent: any) {
    const fileReader = new FileReader();
    let text: string | ArrayBuffer | null = "";
    fileReader.onload = () => {
      text = fileReader.result;
      let parseString = xml2js.parseString;
      // @ts-ignore
      parseString(text, (err: any, result: any) => {
        this.coordinates = result.gpx.trk[0].trkseg[0].trkpt.map((tpt: any) => (
            [Number(tpt.$["lat"]), Number(tpt.$["lon"])]
          )
        );
        if (this.coordinates) {
          this.layers = [polyline(this.coordinates.map(m => new LatLng(m[0], m[1])))]
          this.fitToBounds = polyline(this.coordinates.map(m => new LatLng(m[0], m[1]))).getBounds()
        }
      });
    };
    fileReader.readAsText(fileInputEvent.target.files[0]);
  }

  onNoClick(event: Event): void {
    event.preventDefault();
  }

  compareTrips = (o1: any, o2: any) => {
    return o1.id === o2.id
  }


  remove(feature: any): void {
    const index = this.mapFeatures.findIndex((mf:any) => mf.id === feature.id);

    if (index >= 0) {
      this.mapFeatures.splice(index, 1);
      const layersIndex = this.layers.findIndex((l:any) => l.options.title === feature.id)
      if (layersIndex >= 0){
        this.layers.splice(layersIndex, 1);
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.mapFeatures.findIndex((mf:any) => mf.id === event.option.value.id) >= 0) {
      this._snackBar.open("You can't select the same map feature twice.", "close", {
        panelClass: ['red-snackbar']
      });
    } else {
      this.mapFeatures.push(event.option.value);
      this.featureInput.nativeElement.value = '';
      this.featureCtrl.setValue(null);
      this.layers.push(marker(event.option.value.coordinate, {
            title: event.option.value.id,
            icon: icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'leaflet/marker-icon.png',
              shadowUrl: 'leaflet/marker-shadow.png'
            })
          })
        )

    }
  }

  private _filter(value: any): string[] {
    let filterValue: any
    if (value.name) {
      filterValue = value.name.toLowerCase();
    } else {
      filterValue = value.toLowerCase();
    }
    return this.allMapFeatures.filter(feature => feature.name.toLowerCase().includes(filterValue));
  }

  private _filterTrips(value: any): string[] {
    let filterValue: any
    if (value.name) {
      filterValue = value.name.toLowerCase()
    } else {
      filterValue = value.toLowerCase();
    }
    return this.allTrips.filter((trip: any) => trip.name.toLowerCase().includes(filterValue));
  }

  displayFn(value: any) {
    return value ? value.name : undefined;
  }

  delete(){
    if (this.id) {
      this.tripService.deleteTrip(this.id).subscribe({
        next: () => ResponseHelpers.handlePostResponse(this._snackBar, this.router, '/trips'),
        error: (error) => ResponseHelpers.handlePostError(error, this._snackBar),
      });
    }
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      // @ts-ignore
      target: event.target,
      message: `Are you sure that you want to delete ${this.eventForm.value["name"]}`,
      accept: () => {
        this.delete()
      },
      reject: () => {
        return
      }
    });
  }


}




