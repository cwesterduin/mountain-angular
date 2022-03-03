import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DndComponent} from "./dnd/dnd.component";
import {FolderComponent} from "./folder/folder.component"; // CLI imports router

const routes: Routes = [
  { path: 'first-component', component: DndComponent },
  { path: 'second-component', component: FolderComponent },
];
// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
