import {Component, OnInit, ViewChild} from '@angular/core';
import {Data} from "../folder/folder.service";
import {MapFeatureService} from "./map-feature.service";
import {Router} from "@angular/router";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from "@angular/material/table";

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

  @ViewChild(MatSort) sort: MatSort;
  dataSource : any = [];
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.mapFeatureService.getMapFeatures()
      .subscribe((data: Data) => {
        this.displayedColumns = Object.keys(data[0])
        this.dataSource  = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      })
  }


  async goToEdit(elementElement: any) {
    await this.router.navigate(["/map-features/edit/" + elementElement])
  }

}
