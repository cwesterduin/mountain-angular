import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MapFeatureService} from "./map-feature.service";

@Component({
  selector: 'app-create-map-feature',
  templateUrl: './create-map-feature.html',
  styleUrls: ['../event/event.component.css', './map-feature.component.css']
})
export class CreateMapFeatureComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private mapFeatureService: MapFeatureService,
    private _snackBar: MatSnackBar
  ) {
  }

  public found: boolean | undefined;
  public loading: boolean = true;
  public id: string | undefined

  mapFeatureForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(''),
    coordinate: new FormControl(''),
    translation: new FormControl(''),
    pronunciation: new FormControl(''),
    munroOrder: new FormControl(''),
    image: new FormControl('')
  });

  ngOnInit(): void {
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

  onSubmit() {
    let data = this.mapFeatureForm.value
    data.coordinate = null
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
}




