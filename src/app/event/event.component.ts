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

  async goToEdit(elementElement: any) {
    await this.router.navigate(["/events/edit/" + elementElement])
  }


}


