import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Data, FolderService} from "../folder/folder.service";
import {ImageService} from "./s3-image.service";

@Component({
  selector: 'app-s3-image',
  templateUrl: './s3-image.component.html',
  styleUrls: ['./s3-image.component.css']
})
export class S3ImageComponent implements OnInit, OnChanges {

  @Input('path') path = [];
  @Output() selectCallback: EventEmitter<any> = new EventEmitter();
  constructor(private imageService: ImageService) { }

  imageData: Array<any> = []
  selected: any = undefined

  ngOnInit(): void {
  }

  ngOnChanges() : void {
    this.imageData = []
    this.imageService.getImages("alfie192345", this.path.join("/") + "/")
      // clone the data object, using its known Config shape
      .subscribe((data: Array<any>) => {
        this.imageData = data
      })


  }


  selectThis(img: any, i: any) {
    this.selectCallback.emit(img)
    this.selected = img.id;
  }
}
