import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthPage } from './health';

@NgModule({
  declarations: [
    HealthPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthPage),
  ],
  exports: [
    HealthPage
  ]
})
export class HealthModule {}
