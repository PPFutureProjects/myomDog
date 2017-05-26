import { Component } from '@angular/core';
// import { HealthPage } from '../../pages/health/health'
// import { FirebaseListObservable } from 'angularfire2/database';
/**
 * Generated class for the HealthListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'health-list',
  templateUrl: 'health-list.html'
})
export class HealthListComponent {

  // dogHistory:FirebaseListObservable<any[]>;

  constructor() {
    console.log('Hello HealthListComponent Component');
    // this.dogHistory = getHealthItems;
  }

  editItem(history){
    console.log('edit item');
  }

  deleteItem(history){
    console.log('delete item');
  }

}
