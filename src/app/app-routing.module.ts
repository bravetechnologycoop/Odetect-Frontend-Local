import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SensorsComponent } from './sensors/sensors.component';
import { SignoutComponent } from './signout/signout.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: '\sensors', component: SensorsComponent},
  { path: '\signout', component: SignoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
