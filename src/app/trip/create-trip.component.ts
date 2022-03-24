import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TripService} from "./trip.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FolderComponent} from "../folder/folder.component";
import {MatDialog} from "@angular/material/dialog";
import {ResponseHelpers} from "../helpers/responseHelpers";

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./trip.component.css', '../helpers/snackbar.css']
})
export class CreateTripComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripService: TripService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }

  public found: boolean | undefined;
  public loading: boolean = true;
  public id: string | undefined

  public primaryImage: any

  tripForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      this.id = params["id"]
    })
    if (this.id) {
      this.tripService.getOneTrip(this.id).subscribe({
        next: this.handleResponse.bind(this),
        error: this.handleError.bind(this),
      });
    } else {
      this.loading = false
      this.found = true
    }
  }

  handleResponse(data: any) {
    this.tripForm.patchValue({
      name: data["name"],
      description: data["description"],
    })
    this.primaryImage = data.primaryImage
    if (this.primaryImage) {
      this.primaryImage.path = "https://" + this.primaryImage.bucketName + ".s3." + this.primaryImage.region + ".amazonaws.com/" + this.primaryImage.path
    }
  }

  handleError(error: any) {
    if (error.message == "404") {
      this.found = false
    }
    this.loading = false
  }

  onSubmit() {
    let data = this.tripForm.value
    data.primaryImage = this.primaryImage
    if (this.id) {
      data.id = this.id
    }
    this.tripService.postTrip(data).subscribe({
      next: () => ResponseHelpers.handlePostResponse(this._snackBar, this.router, '/trips'),
      error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar),
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(FolderComponent, {
      panelClass: 'large-dialog',
      data: {
        appendMedia: (image: any) => this.primaryImage = {
          ...image,
          path: "https://" + image.bucketName + ".s3." + image.region + ".amazonaws.com/" + image.path
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
