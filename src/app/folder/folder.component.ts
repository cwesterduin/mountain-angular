import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FolderService, Data} from "./folder.service";
import { Amplify, Auth } from 'aws-amplify';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {
  session: any = Auth.currentSession();

  @Output() selectImage: EventEmitter<any> = new EventEmitter();
  constructor(
    private folderService: FolderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  dataSource : any = [];

  currentDepth : number = 0;

  path : any = [];

  currentFolder : string | null = null

  childFolders : any = []

  selected: any = undefined


  ngOnInit(): void {
      this.folderService.getConfig()
        // clone the data object, using its known Config shape
        .subscribe((data: Data) => {
          this.dataSource = data.map((d : any) => d.split("/").filter((o: any) => o !== ""))
          this.childFolders = this.dataSource.filter((d: Array<string>) => d.length == 1).sort()
          this.currentFolder = "root"
        })

  }

  updateFolderData(folder: any){
    this.path.push(folder[folder.length - 1])
    //update to force change detection in child
    this.path = [].concat(this.path);
    this.currentFolder = folder[folder.length - 1];
    this.childFolders = this.dataSource.filter((d: any) => this.arraysEqual(d.slice(0, -1), this.path)).sort()
  }

  goBack(){
    if (this.path.length === 0) {}
    else {
      this.path.pop()
      //update to force change detection in child
      this.path = [].concat(this.path);
      this.currentFolder =  this.path[this.path.length - 1];
      if (this.currentDepth === 1) {
        this.childFolders = this.dataSource.filter((d: Array<string>) => d.length == 1)
        this.currentFolder = "root"
      } else {
        this.childFolders = this.dataSource.filter((d: any) => this.arraysEqual(d.slice(0, -1), this.path)).sort()
      }
    }
  }

  goTo(item: string) {
    this.path = this.path.slice(0, this.path.indexOf(item) + 1)
    //update to force change detection in child
    this.path = [].concat(this.path);
    if (item === 'root') {
      this.childFolders = this.dataSource.filter((d: Array<string>) => d.length == 1)
      this.currentFolder = "root"
    } else {
      this.currentFolder = this.path[this.path.length - 1];
      this.childFolders = this.dataSource.filter((d: any) => this.arraysEqual(d.slice(0, -1), this.path)).sort()
    }
    }

  arraysEqual(a1: any,a2: any) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
  }


  select(object: any) {
    console.log(object)
  }


  selectCallback = (args: any): void => {
    this.selected = args
    console.log("called back")
  }

  selectImageSubmit(){
    this.selectImage.emit()
  }

  appendImage(selected: any) {
   this.data.appendMedia(selected)
  }
}
