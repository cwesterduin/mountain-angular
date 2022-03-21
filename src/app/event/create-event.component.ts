import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {Data} from "../folder/folder.service";
import {EventService} from "./event.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./event.component.css']
})
export class CreateEventComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private _snackBar: MatSnackBar
  ) {
  }

  public found: boolean | undefined;
  public loading: boolean = true;
  public id: string | undefined

  eventForm = new FormGroup({
    name: new FormControl('', Validators.required),
    date: new FormControl(''),
    coordinates: new FormControl(''),
    descriptionId: new FormControl(''),
    description: new FormControl(''),
    rating: new FormControl(''),
    elevation: new FormControl(''),
    distance: new FormControl(''),
    media: new FormControl(''),
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
    data.media = null
    data.trip = null
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
}




