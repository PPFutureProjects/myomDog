import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthListComponent } from './health-list';

@NgModule({
  declarations: [
    HealthListComponent,
  ],
  imports: [
    IonicPageModule.forChild(HealthListComponent),
  ],
  exports: [
    HealthListComponent
  ]
})
export class HealthListComponentModule {}
