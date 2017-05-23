import { Component } from '@angular/core';

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

  text: string;
  dogHistory:[History]

  constructor() {
    console.log('Hello HealthListComponent Component');
    this.text = 'Hello World';
  }

  editItem(history){
    console.log('edit item');
  }

  deleteItem(history){
    console.log('delete item');
  }
  
}
