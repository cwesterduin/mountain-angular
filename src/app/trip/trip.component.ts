import {Component, OnInit} from '@angular/core';
import {EventService} from "../event/event.service";
import {TripService} from "./trip.service";
import {Data} from "../folder/folder.service";
import {Router} from "@angular/router";

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

  dataSource: any = [];
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.tripService.getTrips()
      .subscribe((data: Data) => {
        this.displayedColumns = Object.keys(data[0])
        this.dataSource = data
      })
  }

  async goToEdit(elementElement: any) {
    await this.router.navigate(["/trips/edit/" + elementElement])
  }

}
