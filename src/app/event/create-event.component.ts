import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {EventService} from "./event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FolderComponent} from "../folder/folder.component";
import {MatDialog} from "@angular/material/dialog";
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import xml2js from 'xml2js';
import {
  LatLng,
  LatLngBounds,
  Layer,
  polyline,
  tileLayer
} from "leaflet";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./event.component.css']
})
export class CreateEventComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _ngZone: NgZone
  ) {
  }

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
    this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      this.id = params["id"]
    })
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
      ],
      zoom: 5,
      center: [55,-3]
    };
    if (this.id) {
      this.eventService.getOneEvent(this.id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    } else {
      this.loading = false
      this.found = true
    }
  }

  handleResponse(data: any) {
    this.eventForm.patchValue({
      name: data["name"],
      date: data["date"],
      descriptionId: data["descriptionId"],
      description: data["description"],
      rating: data["rating"],
      elevation: data["elevation"],
      distance: data["distance"]
    })
    this.coordinates = data["coordinates"]
    if (this.coordinates) {
      this.layers = [polyline(this.coordinates.map(m => new LatLng(m[0], m[1])))]
      this.fitToBounds = polyline(this.coordinates.map(m => new LatLng(m[0], m[1]))).getBounds()
    }

    this.media = data["media"].sort((a: any, b: any) => (a.sortOrder > b.sortOrder) ? 1 : (a.sortOrder === b.sortOrder) ? ((a.sortOrder > b.sortOrder) ? 1 : -1) : -1)
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


  //   })
  // }


  onSubmit() {
    let data = this.eventForm.value
    data.date = Date.parse(this.eventForm.get('date')?.value)
    data.coordinates = this.coordinates
    data.media = this.media.map((m, i) => ({
        ...m,
        sortOrder: i
      })
    )
    data.trip = null
    data.mapFeatures = null
    if (this.id) {
      data.id = this.id
      this.eventService.postEvent(data).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handlePostError.bind(this),
      });
    } else {
      this.eventService.postEvent(data).subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handlePostError.bind(this),

      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.media, event.previousIndex, event.currentIndex);
    console.log(this.media)
  }

  openDialog() {
    const dialogRef = this.dialog.open(FolderComponent, {
      panelClass: 'large-dialog',
      data: {
        appendMedia: (image: any) => this.appendMedia(image)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  appendMedia(image: any) {
    let processedImage = {
      path: "https://" + image.bucketName + ".s3." + image.region + ".amazonaws.com/" + image.path,
      mediaId: image.id,
      id: null,
      sortOrder: null
    }
    if (this.media.some(m => m.mediaId === processedImage.mediaId)) {
      this._snackBar.open("You can't add the same media twice!", "close", {
        panelClass: ['red-snackbar']
      });
    } else {
      this.media.push(processedImage)
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



}




