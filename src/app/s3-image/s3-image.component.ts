import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-s3-image',
  templateUrl: './s3-image.component.html',
  styleUrls: ['./s3-image.component.css']
})
export class S3ImageComponent implements OnInit {

  @Input('path') path = '';

  constructor() { }

  ngOnInit(): void {
  }

}
