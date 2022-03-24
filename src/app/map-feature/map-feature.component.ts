import { Component, OnInit } from '@angular/core';
import {Data} from "../folder/folder.service";
import {MapFeatureService} from "./map-feature.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-map-feature',
  templateUrl: './map-feature.component.html',
  styleUrls: ['./map-feature.component.css']
})
export class MapFeatureComponent implements OnInit {

  constructor(
    private mapFeatureService: MapFeatureService,
    private router: Router,
  ) { }

  dataSource : any = [];
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.mapFeatureService.getMapFeatures()
      .subscribe((data: Data) => {
        this.displayedColumns = Object.keys(data[0])
        this.dataSource = data
      })
  }

  async goToEdit(elementElement: any) {
    await this.router.navigate(["/map-features/edit/" + elementElement])
  }

}
