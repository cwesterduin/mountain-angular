import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FolderComponent} from "../folder/folder.component";
import {DndComponent} from "../dnd/dnd.component";
import {EventService} from "./event.service";
import {Data} from "../folder/folder.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private eventService: EventService,
    private router: Router,
  ) { }

  dataSource : any = [];
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.eventService.getEvents()
      .subscribe((data: Data) => {
        this.displayedColumns = Object.keys(data[0])
        this.dataSource = data
      })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DndComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async goToEdit(elementElement: any) {
    console.log(elementElement)
    await this.router.navigate(["/events/edit/" + elementElement])
  }
}


