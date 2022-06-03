import {Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output} from '@angular/core';
import {Data, FolderService} from "../folder/folder.service";
import {ImageService} from "./s3-image.service";
import {FormControl} from "@angular/forms";
import {ResponseHelpers} from "../helpers/responseHelpers";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-s3-description',
  templateUrl: './s3-description.component.html',
  styleUrls: ['./s3-image.component.css']
})
export class S3DescriptionComponent implements OnInit {

  @Input('img') img: any;
  constructor(
    private imageService: ImageService,
    private _snackBar: MatSnackBar,
  ) { }

  editMode: boolean = false;
  description: string = ''

  ngOnInit(): void {
    this.description = this.img.description
  }

  setEditMode() {
    this.editMode = !this.editMode;
  }

  onSubmit() {
    let id;
    this.img.mediaId ? id = this.img.mediaId : id = this.img.id
    this.imageService.updateDescription(id, this.description).subscribe({
      next: () => {
        ResponseHelpers.handlePostResponse(this._snackBar);
        this.editMode = false;
        this.img.description = this.description
      },
      error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar),
    });
  }
}
