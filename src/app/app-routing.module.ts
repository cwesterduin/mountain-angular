import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CanActivateAuth} from "./can-activate-auth";
import {IndexComponent} from "./index/index.component";
import {EventComponent} from "./event/event.component";
import {CreateEventComponent} from "./event/create-event.component";
import {MapFeatureComponent} from "./map-feature/map-feature.component";
import {CreateMapFeatureComponent} from "./map-feature/create-map-feature";
import {TripComponent} from "./trip/trip.component";
import {CreateTripComponent} from "./trip/create-trip.component"; // CLI imports router


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
        path: 'events',
        canActivate: [CanActivateAuth],
        children: [
          {
            path: '',
            component: EventComponent,
          },
          {
            path: 'create',
            component: CreateEventComponent,
          },
          {
            path: 'edit/:id',
            component: CreateEventComponent,
          }
        ]
      },
      {
        path: 'map-features',
        canActivate: [CanActivateAuth],
        children: [
          {
            path: '',
            component: MapFeatureComponent,
          },
          {
            path: 'create',
            component: CreateMapFeatureComponent,
          },
          {
            path: 'edit/:id',
            component: CreateMapFeatureComponent,
          }
        ]
      },
      {
        path: 'trips',
        canActivate: [CanActivateAuth],
        children: [
          {
            path: '',
            component: TripComponent,
          },
          {
            path: 'create',
            component: CreateTripComponent,
          },
          {
            path: 'edit/:id',
            component: CreateTripComponent,
          }
        ]
      }
    ])
  ],
  exports: [RouterModule],
  providers: [CanActivateAuth]
})
export class AppRoutingModule {
}
