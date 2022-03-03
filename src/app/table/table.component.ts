import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Data, TableService} from "./table.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  // input data source
  dataSource : any = [];
  tableData: any;

  displayedColumns: string[] = ['name', 'coordinates', 'media'];

  constructor(private tableService: TableService) { }

  ngOnInit(): void {

     this.tableService.getConfig()
      // clone the data object, using its known Config shape
      .subscribe((data: Data) => this.dataSource = data);
  }

  refresh() {
  }

}


