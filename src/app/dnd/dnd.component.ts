import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.css']
})
export class DndComponent {

  constructor(private http: HttpClient) { }

  public files: NgxFileDropEntry[] = [];
  public formData: FormData = new FormData()

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    // Is it a file?
    for (const droppedFile of this.files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.formData.append('files', file, droppedFile.relativePath)
        });
      } else {
        this.formData.append('folders', new Blob(), droppedFile.relativePath)
      }
    }

  }



  uploadFiles() {
    for (let pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }

    this.http.post('http://localhost:8080/s3/testbucket240222/upload', this.formData)
      .subscribe(data => {
        console.log(data)
      })


    // } else {
    //   // It was a directory (empty directories are added, otherwise only files)
    //   const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
    //   // formData.append('files', "folder", droppedFile.relativePath)
    // }
    // }

  }


  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }
}
