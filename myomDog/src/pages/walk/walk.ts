import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TimerComponent } from '../../component/timer/timer'

/**
 * Generated class for the Walk page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-walk',
  templateUrl: 'walk.html',
})
export class WalkPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
 addpincininfo(){
   //미완성
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Walk');
  }

}
