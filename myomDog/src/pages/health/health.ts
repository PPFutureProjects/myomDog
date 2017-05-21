import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ManageService } from '../../providers/manage-service';

import { History } from './History'

/**
 * Generated class for the Health page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-health',
  templateUrl: 'health.html'
})
export class HealthPage {

  graph: string = "week"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  history: string = "everything"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  isAndroid: boolean = false;

  dogHistory:[History]

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public manageService: ManageService) {
    this.isAndroid = platform.is('android');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Health');
  }

}

@Component({
  selector: 'sliding-list-item',
  template:
  `<ion-item-sliding>
    <ion-item>
    <!--
      <ion-icon name="{{history.icon}}" item-left></ion-icon>
        {{history.name}}
      <ion-note item-right>{{history.time | date:'MM/dd jm'}}</ion-note>
    </ion-item>
    -->
    <ion-item>
      <ion-icon name="medkit" item-left></ion-icon>
        예방 주사
      <ion-note item-right>03/03 10:30</ion-note>
    </ion-item>
    <ion-item-options>
      <edit-remove-slide-options></edit-remove-slide-options>
    </ion-item-options>
  </ion-item-sliding>`
})
export class SlideItem {
  constructor(){

  }
}
// Slide List의 옵션 컴포넌트 -------------------------------------
@Component({
  selector: 'edit-remove-slide-options',
  template: `<button ion-button color="primary" icon-left>
      <ion-icon name="create"></ion-icon>
      편집
    </button>
    <button ion-button color="danger" icon-left>
      <ion-icon name="trash"></ion-icon>
      삭제
    </button>`
})
export class SlideOptions {
  constructor(){
  }
}
// ------------------------------------- Slide List의 옵션 컴포넌트
