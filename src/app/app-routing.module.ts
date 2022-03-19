import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DndComponent} from "./dnd/dnd.component";
import {FolderComponent} from "./folder/folder.component";
import { CanActivateAuth } from "./can-activate-auth";
import {LoginComponent} from "./login/login.component";
import {IndexComponent} from "./index/index.component"; // CLI imports router


// configures NgModule imports and exports

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: IndexComponent,
        pathMatch: 'full'
      },
      {
        path: 'first-component',
        component: DndComponent,
        canActivate: [CanActivateAuth]
      },
      {
        path: 'second-component',
        component: FolderComponent,
        canActivate: [CanActivateAuth]
      }
    ])
  ],
  exports: [RouterModule],
  providers: [CanActivateAuth]
})
export class AppRoutingModule { }
