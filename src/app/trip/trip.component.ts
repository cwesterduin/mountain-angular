import {Component, OnInit, ViewChild} from '@angular/core';
import {EventService} from "../event/event.service";
import {TripService} from "./trip.service";
import {Data} from "../folder/folder.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

  constructor(
    private tripService: TripService,
    private router: Router,
  ) {
  }
  @ViewChild(MatSort) sort: MatSort;

  dataSource: any = [];
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.tripService.getTrips()
      .subscribe((data: Data) => {
        this.displayedColumns = Object.keys(data[0])
        this.dataSource  = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      })
  }

  async goToEdit(elementElement: any) {
    await this.router.navigate(["/trips/edit/" + elementElement])
  }

}
