import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FolderComponent} from "../folder/folder.component";
import {DndComponent} from "../dnd/dnd.component";
import {EventService} from "./event.service";
import {Data} from "../folder/folder.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

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
  @ViewChild(MatSort) sort: MatSort;
  dataSource : any = [];
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.eventService.getEvents()
      .subscribe((data: Data) => {
        this.displayedColumns = Object.keys(data[0])
        this.dataSource  = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      })
  }

  async goToEdit(elementElement: any) {
    await this.router.navigate(["/events/edit/" + elementElement])
  }


}


