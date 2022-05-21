import {Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output} from '@angular/core';
import {Data, FolderService} from "../folder/folder.service";
import {ImageService} from "./s3-image.service";

@Component({
  selector: 'app-s3-image',
  templateUrl: './s3-image.component.html',
  styleUrls: ['./s3-image.component.css']
})
export class S3ImageComponent implements OnInit, OnChanges {

  @Input('path') path = [];
  @Optional() @Input('multiselect') multiselect: boolean;
  @Output() selectCallback: EventEmitter<any> = new EventEmitter();
  @Output() deselectCallback: EventEmitter<any> = new EventEmitter();
  constructor(private imageService: ImageService) { }

  imageData: Array<any> = []
  selected: Array<string> = []

  ngOnInit(): void {
  }

  ngOnChanges() : void {
    this.imageData = []
    this.imageService.getImages(this.path.join("/") + "/")
      // clone the data object, using its known Config shape
      .subscribe((data: Array<any>) => {
        this.imageData = data
      })


  }


  selectThis(img: any, i: any) {
    if (this.multiselect) {
      if (!this.selected.includes(img.id)) {
        this.selectCallback.emit(img)
        this.selected.push(img.id)
      } else {
        let selectedIndex = this.selected.findIndex((im: any) => im == img.id)
        this.selected.splice(selectedIndex, 1);
        this.deselectCallback.emit(img)
      }
    } else {
      if (this.selected != img.id) {
        this.selectCallback.emit(img)
        this.selected = [img.id];
      } else {
        this.deselectCallback.emit(img)
        this.selected = []
      }
    }
  }
}
