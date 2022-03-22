import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {Data} from "../folder/folder.service";
import {EventService} from "./event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DndComponent} from "../dnd/dnd.component";
import {FolderComponent} from "../folder/folder.component";
import {MatDialog} from "@angular/material/dialog";

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
  ) {
  }

  public found: boolean | undefined;
  public loading: boolean = true;
  public id: string | undefined

  public media: Array<any> = []

  eventForm = new FormGroup({
    name: new FormControl('', Validators.required),
    date: new FormControl(''),
    coordinates: new FormControl(''),
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
      date: data["date"]
    })
    this.media = data["media"].sort((a: any,b: any) => (a.sortOrder > b.sortOrder) ? 1 : (a.sortOrder === b.sortOrder) ? ((a.sortOrder > b.sortOrder) ? 1 : -1) : -1 )
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


  //   })
  // }


  onSubmit() {
    let data = this.eventForm.value
    data.date = Date.parse(this.eventForm.get('date')?.value)
    data.coordinates = null
    data.eventMedia = this.media.map((m,i) => ({
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
      data: {
        appendMedia: (image: any) => this.appendMedia(image)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  appendMedia(image: any){
    this.media.push(image)
  }

}




