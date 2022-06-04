import {Component, Input} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import {DndService} from "./dnd.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DomSanitizer} from "@angular/platform-browser";
import {ResponseHelpers} from "../helpers/responseHelpers";

@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.css', '../helpers/snackbar.css']
})
export class DndComponent {

  @Input('path') path = [];
  @Input('reload') reload: () => void;

  constructor(
    private dndService: DndService,
    private _snackBar: MatSnackBar,
  ) { }

  public files: NgxFileDropEntry[] = [];
  public formData: FormData;
  public previews: any = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.formData = new FormData()
    this.previews = []
    this.files = files.map((f: NgxFileDropEntry) => new NgxFileDropEntry(this.path.join("/") + "/" + f.relativePath, f.fileEntry))
    // Is it a file?
    for (const droppedFile of this.files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          const reader = new FileReader();
          reader.onload = () => this.previews.push({src: reader.result, name: file.name});
          reader.readAsDataURL(file);

          this.formData.append('files', file, droppedFile.relativePath)
        });
      } else {
        this.formData.append('folders', new Blob(),droppedFile.relativePath)
      }
    }

  }


  uploadFiles() {
    this.dndService.postFiles(this.formData).subscribe({
      next: () => {
        ResponseHelpers.handlePostResponse(this._snackBar);
        this.cancel()
        this.reload()
      },
      error: (error) =>  ResponseHelpers.handlePostError(error, this._snackBar)
    });
  }

  cancel() {
    this.formData = new FormData()
    this.previews = []
    this.files = []
  }
}
