import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Data, FolderService} from "../folder/folder.service";
import {ImageService} from "./s3-image.service";

@Component({
  selector: 'app-s3-image',
  templateUrl: './s3-image.component.html',
  styleUrls: ['./s3-image.component.css']
})
export class S3ImageComponent implements OnInit, OnChanges {

  @Input('path') path = [];
  constructor(private imageService: ImageService) { }

  imageData: Array<any> = []

  ngOnInit(): void {
  }

  ngOnChanges() : void {
    this.imageData = []
    this.imageService.getImages("testbucket240222", this.path.join("/") + "/")
      // clone the data object, using its known Config shape
      .subscribe((data: Array<any>) => {
        this.imageData = data
      })


  }


}
